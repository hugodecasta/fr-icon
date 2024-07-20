import fs from 'fs'
import fetch from 'node-fetch'

const css_content = fs.readFileSync('css/icons.css', 'utf8').split('\n')
    .filter(l => l.includes('/css/icons/'))
    .map(l => l.split('/css/icons/')[1].replace(');', '').replace(')', ''))
    .filter((e, i, s) => s.indexOf(e) == i)

for (const image of css_content) {
    const url = 'https://www.systeme-de-design.gouv.fr/_nuxt/img/' + image
    console.log(image, '...')
    const blob = await (await fetch(url)).blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync('css/icons/' + image, buffer)
}