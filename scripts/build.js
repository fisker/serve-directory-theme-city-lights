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
  var file = name + '-icon-active.svg'
  var svg = fs.readFileSync(CITYLIGHTS_ICONS_DIR + file, 'utf-8')
  // .replace('<svg', '<svg fill="#6a737d"')
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
    return /\-icon\-active\.svg$/.test(icon)
  })
  .forEach(function(icon) {
    Object.assign(
      asserts.icons,
      getIcon(icon.match(/^(^.*?)\-icon\-active\.svg$/)[1])
    )
  })

asserts.icons.default =
  '.file__icon_default{background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDEyIDE2IiBjbGFzcz0iIiBhcmlhLWhpZGRlbj0idHJ1ZSIgZmlsbD0iIzZhNzM3ZCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02IDVIMlY0aDR2MXpNMiA4aDdWN0gydjF6bTAgMmg3VjlIMnYxem0wIDJoN3YtMUgydjF6bTEwLTcuNVYxNGMwIC41NS0uNDUgMS0xIDFIMWMtLjU1IDAtMS0uNDUtMS0xVjJjMC0uNTUuNDUtMSAxLTFoNy41TDEyIDQuNXpNMTEgNUw4IDJIMXYxMmgxMFY1eiIvPjwvc3ZnPg==)}'

fs.writeFileSync('../dist/asserts.json', JSON.stringify(asserts))
fs.writeFileSync('../dist/index.js', fs.readFileSync('../src/index.js'))
