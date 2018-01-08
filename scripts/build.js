var fs = require('fs')
var nodeSass = require('node-sass')
var CITYLIGHTS_ICONS_DIR = '../node_modules/city-lights-icons/icons/'

var btoa = global.btoa || require('btoa')

var iconMap = {
  folder: 'directory',
  ds_store: 'ds-store'
}

var baseStyle = nodeSass
  .renderSync({
    file: '../src/style.scss',
    outputStyle: 'compressed'
  })
  .css.toString()
  .trim()

var template = fs
  .readFileSync('../src/directory.html', 'utf-8')
  .replace(/>\s*</g, '><')

var asserts = {
  css: baseStyle,
  template: template,
  icons: {}
}

function getIcon(name) {
  var className = iconMap[name] || name
  var file = name + '-icon.svg'
  var svg = fs
    .readFileSync(CITYLIGHTS_ICONS_DIR + file, 'utf-8')
    .replace('<svg', '<svg fill="#6a737d"')
  // ie can't recognize
  // var img = 'url(data:image/svg+xml;utf8,' + encodeURIComponent(svg)
  var img = 'data:image/svg+xml;base64,' + btoa(svg)
  var css = '.file__icon_' + className + '{background-image:url(' + img + ')}'
  return {
    [className]: css
  }
}

var citylightsIcons = fs.readdirSync(CITYLIGHTS_ICONS_DIR)

citylightsIcons
  .filter(function(icon) {
    return /\-icon\.svg$/.test(icon)
  })
  .forEach(function(icon) {
    Object.assign(asserts.icons, getIcon(icon.match(/(^.*?)\-icon\.svg$/)[1]))
  })

fs.writeFileSync('../dist/asserts.json', JSON.stringify(asserts))
fs.writeFileSync('../dist/index.js', fs.readFileSync('../src/index.js'))
