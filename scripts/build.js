const CHARSET = 'utf-8'
const CITYLIGHTS_ICONS_DIR = '../node_modules/city-lights-icons/icons/'

const fs = require('fs')
const nodeSass = require('node-sass')
const babel = require('babel-core')
const prettier = require('prettier')
const stringify = require('json-stable-stringify')
const babelConfig = JSON.parse(fs.readFileSync('../.babelrc', CHARSET))

const btoa = global.btoa || require('btoa')

const iconMap = {
  folder: 'directory',
  ds_store: 'ds-store'
}

const baseStyle = nodeSass
  .renderSync({
    file: '../src/style.scss',
    outputStyle: 'compressed'
  })
  .css.toString()
  .trim()

const template = fs
  .readFileSync('../src/directory.ejs', CHARSET)
  .replace(/>\s*</g, '><')

const asserts = {
  css: baseStyle,
  template: template,
  icons: {}
}

function getIcon(name) {
  var file = name + '-icon-active.svg'
  var svg = fs.readFileSync(CITYLIGHTS_ICONS_DIR + file, CHARSET)
  // .replace('<svg', '<svg fill="#6a737d"')
  // ie can't recognize
  // var img = 'url(data:image/svg+xml;utf8,' + encodeURIComponent(svg)
  var img = 'data:image/svg+xml;base64,' + btoa(svg)
  return img
}

var citylightsIcons = fs.readdirSync(CITYLIGHTS_ICONS_DIR)

citylightsIcons
  .filter(function(icon) {
    return /\-icon\-active\.svg$/.test(icon)
  })
  .forEach(function(icon) {
    icon = icon.match(/^(^.*?)\-icon\-active\.svg$/)[1]
    asserts.icons[iconMap[icon] || icon] = getIcon(icon)
  })

fs.writeFileSync('../dist/asserts.json', stringify(asserts, {space: 2}))
fs.writeFileSync(
  '../dist/index.js',
  (function() {
    let code = fs.readFileSync('../src/index.js', CHARSET)
    code = babel.transform(code, babelConfig).code
    code = prettier.format(
      code,
      prettier.resolveConfig.sync('../dist/index.js')
    )
    return code
  })()
)
