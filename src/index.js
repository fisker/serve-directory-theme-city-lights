import prettyBytes from 'pretty-bytes'
import uniq from 'lodash.uniq'
import asserts from './asserts.json'

function getIconName(file) {
  if (file.isDirectory()) {
    return 'directory'
  }

  const {name} = file
  const extension = file.ext.slice(1)
  const {type} = file

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

  if (extension === 'yml' || extension === 'yaml') {
    return 'yaml'
  }

  if (extension === 'htm' || extension === 'html') {
    return 'html'
  }

  if (
    extension === 'es' ||
    extension === 'es6' ||
    extension === 'js' ||
    extension === 'mjs'
  ) {
    return 'js'
  }

  if (extension === 'clj' || extension === 'cljs') {
    return 'clojure'
  }

  if (extension === 'json' || extension === 'json5') {
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

  if (extension === 'cs') {
    return 'csharp'
  }

  if (extension === 'py' || name === 'requirements.txt') {
    return 'python'
  }

  if (extension === 'sass' || extension === 'scss') {
    return 'sass'
  }

  if (
    extension === 'markdown' ||
    extension === 'mdown' ||
    extension === 'mkd' ||
    extension === 'mkdown' ||
    extension === 'md'
  ) {
    return 'markdown'
  }

  if (
    extension === 'eot' ||
    extension === 'ttf' ||
    extension === 'woff' ||
    extension === 'woff2'
  ) {
    return 'font'
  }

  if (
    extension === 'rb' ||
    extension === 'ru' ||
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

  if (extension === 'hbs' || extension === 'handlebars') {
    return 'handlebars'
  }

  if (extension === 'styl') {
    return 'stylus'
  }

  if (name === '.babelrc') {
    return 'babel'
  }

  if (extension === 'ts' || extension === 'tsx') {
    return 'typescript'
  }

  if (extension === 'cjsx' || extension === 'coffee' || extension === 'cson') {
    return 'coffeescript'
  }

  if (name === '.dockerignore' || name === 'Dockerfile') {
    return 'docker'
  }

  if (extension === 'java' || extension === 'jar') {
    return 'java'
  }

  if (extension === 'sh') {
    return 'bash'
  }

  if (name === '.nodemonignore' || extension === 'nodemon.json') {
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

  if (extension === 'hs') {
    return 'haskell'
  }

  if (extension === 'xls') {
    return 'excel'
  }

  if (extension === 'psd') {
    return 'photoshop'
  }

  if (extension === 'ai') {
    return 'illustrator'
  }

  if (extension === 'cpp') {
    return 'cplusplus'
  }

  if (name === 'apache.conf' || name === 'apache.config') {
    return 'apache'
  }

  if (extension === 'sketch' || extension === 'cocoascript') {
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
      'haml',
    ].includes(extension)
  ) {
    return extension
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
  return `.file-icon_type_${icon}{background-image:url("${
    asserts.icons[icon]
  }")}`
}

function getCSS(files) {
  let style = ''
  style += asserts.css
  style += uniq(files.map(getIconName))
    .map(iconToCSS)
    .join('')

  return `<style>${style}</style>`
}

export default {
  imports: {
    getIconName,
    getCSS,
    prettyBytes,
  },
  process: [
    {
      accept: 'text/html',
      render: asserts.template,
    },
  ],
}
