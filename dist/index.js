'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
var prettyBytes = require('pretty-bytes')
var uniq = require('lodash.uniq')
var asserts = require('./asserts.json')

function getIconName(file) {
  if (file.isDirectory()) {
    return 'directory'
  }

  var name = file.name
  var ext = file.ext.slice(1)
  var type = file.type

  // must before first
  if (name === 'circle.yml') {
    return 'circleci'
  }

  if (name === '.eslintignore' || name.startsWith('.eslintrc')) {
    return 'eslint'
  }

  if (
    name === '.npmignore' ||
    name === '.npmrc' ||
    name === 'npm-debug.log' ||
    name === 'package.json'
  ) {
    return 'npm'
  }

  if (name === '.bowerrc' || name === 'bower.json') {
    return 'bower'
  }

  if (name.startsWith('Gruntfile') || name.startsWith('gruntfile')) {
    return 'grunt'
  }

  if (name.startsWith('Gulpfile') || name.startsWith('gulpfile')) {
    return 'gulp'
  }

  //

  if (ext === 'yml' || ext === 'yaml') {
    return 'yaml'
  }

  if (ext === 'htm' || ext === 'html') {
    return 'html'
  }

  if (ext === 'es' || ext === 'es6' || ext === 'js') {
    return 'js'
  }

  if (ext === 'clj' || ext === 'cljs') {
    return 'clojure'
  }

  if (ext === 'json' || ext === 'json5') {
    return 'json'
  }

  if (
    name === '.gitattributes' ||
    name === '.gitconfig' ||
    name === '.gitignore' ||
    name === '.gitkeep' ||
    name === '.gitmodules'
  ) {
    return 'gitignore'
  }

  if (name === '.DS_Store') {
    return 'ds-store'
  }

  if (ext === 'cs') {
    return 'csharp'
  }

  if (ext === 'py' || name === 'requirements.txt') {
    return 'python'
  }

  if (ext === 'sass' || ext === 'scss') {
    return 'sass'
  }

  if (
    ext === 'markdown' ||
    ext === 'mdown' ||
    ext === 'mkd' ||
    ext === 'mkdown' ||
    ext === 'md'
  ) {
    return 'markdown'
  }

  if (ext === 'eot' || ext === 'ttf' || ext === 'woff' || ext === 'woff2') {
    return 'font'
  }

  if (
    ext === 'rb' ||
    ext === 'ru' ||
    name === 'Appraisals' ||
    name === 'Berksfile' ||
    name === 'Capfile' ||
    name === 'Dangerfile' ||
    name === 'Deliverfile' ||
    name === 'Fastfile' ||
    name === 'Guardfile' ||
    name === 'Jarfile' ||
    name === 'Mavenfile' ||
    name === 'Podfile' ||
    name === 'Puppetfile' ||
    name === 'Rakefile' ||
    name === 'Snapfile'
  ) {
    return 'ruby'
  }

  if (name === 'Gemfile') {
    return 'gemfile'
  }

  if (ext === 'hbs' || ext === 'handlebars') {
    return 'handlebars'
  }

  if (ext === 'styl') {
    return 'stylus'
  }

  if (name === '.babelrc') {
    return 'babel'
  }

  if (ext === 'ts' || ext === 'tsx') {
    return 'typescript'
  }

  if (ext === 'cjsx' || ext === 'coffee' || ext === 'cson') {
    return 'coffeescript'
  }

  if (name === '.dockerignore' || name === 'Dockerfile') {
    return 'docker'
  }

  if (ext === 'java' || ext === 'jar') {
    return 'java'
  }

  if (ext === 'sh') {
    return 'bash'
  }

  if (name === '.nodemonignore' || ext === 'nodemon.json') {
    return 'node'
  }

  if (name === '.travis') {
    return 'travis'
  }

  if (name === 'Procfile') {
    return 'heroku'
  }

  if (name === 'yarn.lock') {
    return 'yarn'
  }

  if (name === '.editorconfig') {
    return 'editorconfig'
  }

  if (name === '.bootstrap' || name === '.bootstraprc') {
    return 'bootstrap'
  }

  if (ext === 'hs') {
    return 'haskell'
  }

  if (ext === 'xls') {
    return 'excel'
  }

  if (ext === 'psd') {
    return 'photoshop'
  }

  if (ext === 'ai') {
    return 'illustrator'
  }

  if (ext === 'cpp') {
    return 'cplusplus'
  }

  if (name === 'apache.conf' || name === 'apache.config') {
    return 'apache'
  }

  if (ext === 'sketch' || ext === 'cocoascript') {
    return 'sketchplugin'
  }

  if (
    [
      'css',
      'jsx',
      'vue',
      'php',
      'less',
      'zip',
      'jade',
      'svg',
      'go',
      'pdf',
      'swift',
      'scala',
      'pug',
      'haml'
    ].includes(ext)
  ) {
    return ext
  }

  if (/^image\/*/.test(type)) {
    return 'image'
  }

  if (/^video\/*/.test(type)) {
    return 'video'
  }

  if (/^audio\/*/.test(type)) {
    return 'audio'
  }

  return 'default'
}

function iconToCSS(icon) {
  return (
    '.file-icon_' + icon + '{background-image:url(' + asserts.icons[icon] + ')}'
  )
}

function getCSS(files) {
  var style = ''
  style += asserts.css
  style += uniq(files.map(getIconName))
    .map(iconToCSS)
    .join('')

  return '<style>' + style + '</style>'
}

exports.default = {
  imports: {
    DIRECTORY_STYLE: 'directory',
    getIconName: getIconName,
    getCSS: getCSS,
    prettyBytes: prettyBytes
  },
  process: [
    {
      accept: 'text/html',
      render: asserts.template
    }
  ]
}
module.exports = exports['default']
