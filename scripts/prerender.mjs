// Injects server-rendered HTML into dist so crawlers see real content.
// Writes the homepage plus one static page per service at dist/services/<slug>/index.html.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
const { render, serviceRoutes, pageRoutes, localRoutes } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)

const ROOT_TAG = '<div id="root"></div>'
if (!template.includes(ROOT_TAG)) throw new Error('prerender: <div id="root"></div> not found in dist/index.html')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const SITE = 'https://pierre-concierge.vercel.app'

// Keep titles within about 60 characters so search results do not cut them off.
const BRAND = 'Pierre Concierge Nursing'
function fitTitle(t) {
    if (t.length <= 60) return t
    const main = t.replace(new RegExp(`\\s*\\|\\s*${BRAND}.*$`), '')
    const noPlace = main.replace(/ in Ocala, FL$/, '').replace(/ at Home in Ocala, FL$/, ' at Home')
    const tries = [`${noPlace} | ${BRAND}`, main, `${noPlace} | Ocala`, noPlace]
    return tries.find((x) => x.length <= 60) || noPlace
}
const allRoutes = [...pageRoutes, ...serviceRoutes, ...localRoutes].map((r) => ({ ...r, title: fitTitle(r.title) }))

// Homepage
fs.writeFileSync(path.join(distDir, 'index.html'), template.replace(ROOT_TAG, `<div id="root">${render('/')}</div>`))

// Service pages
const FAQ_SCHEMA = /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>\s*/

for (const { path: route, title, description } of allRoutes) {
    let html = template
        .replace(FAQ_SCHEMA, (m) => (route === '/faq' ? m : ''))
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
        .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
        .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE}${route}" />`)
        .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
        .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
        .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE}${route}" />`)
        .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`)
        .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`)
        .replace(ROOT_TAG, `<div id="root">${render(route)}</div>`)
    const outDir = path.join(distDir, route.replace(/^\//, ''))
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html)
}

// Sitemap with last updated dates
const today = new Date().toISOString().slice(0, 10)
const urls = ['/', ...allRoutes.map((r) => r.path), '/going-home-checklist.html']
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerender: homepage + ${pageRoutes.length} pages and ${serviceRoutes.length} service pages and ${localRoutes.length} local pages written`)
