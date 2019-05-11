const CHARSET = 'utf-8'
const CITYLIGHTS_ICONS_DIR = '../node_modules/city-lights-icons/icons/'

const fs = require('fs')
const nodeSass = require('node-sass')
const babel = require('@babel/core')
const prettier = require('prettier')
const stringify = require('json-stable-stringify')

const SVGO = require('svgo')
const svgToMiniDataURI = require('mini-svg-data-uri')
const babelConfig = require('../babel.config')

const svgo = new SVGO()

const iconMap = {
  folder: 'directory',
  ds_store: 'ds-store',
}

const baseStyle = nodeSass
  .renderSync({
    file: '../src/style.scss',
    outputStyle: 'compressed',
  })
  .css.toString()
  .trim()

const template = fs
  .readFileSync('../src/directory.ejs', CHARSET)
  .replace(/>\s*</g, '><')

const asserts = {
  css: baseStyle,
  template,
  icons: {},
}

function getIcon(icon) {
  const svg = fs.readFileSync(icon.file, CHARSET)

  return svgo.optimize(svg).then(function(result) {
    let uri = svgToMiniDataURI(result.data)
    uri = uri.replace(
      'data:image/svg+xml,',
      'data:image/svg+xml;charset=utf-8,'
    )
    return {
      ...icon,
      uri,
    }
  })
}

function getIcons() {
  const citylightsIcons = fs
    .readdirSync(CITYLIGHTS_ICONS_DIR)
    .filter(fileName => /-icon-active\.svg$/.test(fileName))
    .map(fileName => {
      let name = fileName.match(/^(^.*?)-icon-active\.svg$/)[1]
      name = iconMap[name] || name
      return {
        name,
        file: CITYLIGHTS_ICONS_DIR + fileName,
      }
    })

  return Promise.all(citylightsIcons.map(getIcon)).then(icons => {
    icons.forEach(icon => {
      asserts.icons[icon.name] = icon.uri
    })
  })
}

getIcons().then(() => {
  fs.writeFileSync('../lib/asserts.json', stringify(asserts, {space: 2}))
  fs.writeFileSync(
    '../lib/index.js',
    (() => {
      let code = fs.readFileSync('../src/index.js', CHARSET)
      code = babel.transform(code, babelConfig).code
      code = prettier.format(
        code,
        prettier.resolveConfig.sync('../lib/index.js')
      )
      return code
    })()
  )
})
