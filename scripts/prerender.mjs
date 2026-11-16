// Injects server-rendered HTML into dist/index.html so crawlers see real content.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const htmlPath = path.join(root, 'dist', 'index.html')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')

const { render } = await import(pathToFileURL(ssrEntry).href)
const appHtml = render()
const html = fs.readFileSync(htmlPath, 'utf8')

if (!html.includes('<div id="root"></div>')) {
    throw new Error('prerender: <div id="root"></div> not found in dist/index.html')
}
fs.writeFileSync(htmlPath, html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`))
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerender: injected ${appHtml.length} chars of HTML into dist/index.html`)
