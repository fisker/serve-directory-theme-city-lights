import fs from 'node:fs'
import path from 'node:path'
import sass from 'sass'
import writePrettierFile from 'write-prettier-file'
import * as svgo from 'svgo'
import svgToMiniDataURI from 'mini-svg-data-uri'
import createEsmUtils from 'esm-utils'

const {__dirname} = createEsmUtils(import.meta)

const CHARSET = 'utf8'
const CITYLIGHTS_ICONS_DIR = path.join(
  __dirname,
  '../node_modules/city-lights-icons/icons/',
)

const iconMap = {
  folder: 'directory',
  ds_store: 'ds-store',
}

async function getIcon(icon) {
  const svg = fs.readFileSync(icon.file, CHARSET)

  const result = await svgo.optimize(svg)

  let uri = svgToMiniDataURI(result.data)
  uri = uri.replace('data:image/svg+xml,', 'data:image/svg+xml;charset=utf-8,')

  return {
    ...icon,
    uri,
  }
}

function getIcons() {
  const citylightsIcons = fs
    .readdirSync(CITYLIGHTS_ICONS_DIR)
    .filter((fileName) => /-icon-active\.svg$/.test(fileName))
    .map((fileName) => {
      let name = fileName.match(/^(^.*?)-icon-active\.svg$/)[1]
      name = iconMap[name] || name
      return {
        name,
        file: CITYLIGHTS_ICONS_DIR + fileName,
      }
    })

  return Promise.all(citylightsIcons.map((icon) => getIcon(icon)))
}

;(async () => {
  const css = sass
    .renderSync({
      file: path.join(__dirname, '../src/style.scss'),
      outputStyle: 'compressed',
    })
    .css.toString()
    .trim()

  const template = fs
    .readFileSync(path.join(__dirname, '../src/directory.ejs'), CHARSET)
    .replace(/>\s*</g, '><')

  let icons = await getIcons()
  icons = Object.fromEntries(
    icons
      .map(({name, uri}) => [name, uri])
      .sort(([name1], [name2]) => name1.localeCompare(name2)),
  )

  await writePrettierFile(
    path.join(__dirname, '../.cache/assets.js'),
    `export default ${JSON.stringify({
      css,
      template,
      icons,
    })}`,
  )
})()
