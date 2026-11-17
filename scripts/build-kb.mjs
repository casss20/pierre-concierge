// Builds a RAG-ready Markdown knowledge base from the website.
//
//   npm run kb
//
// Every route is rendered through the real site code (same React components the live site uses),
// converted to clean Markdown, and written to knowledge-base/.
// The run is incremental: a file is rewritten, and its "extracted" date updated, only when its
// content actually changed. Files for pages that no longer exist are removed.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { parse } from 'node-html-parser'

const root = process.cwd()
const KB = path.join(root, 'knowledge-base')
const SITE = 'https://pierre-concierge.vercel.app'
const TODAY = new Date().toISOString().slice(0, 10)

// ---------- 1. Render every route with the site's own code ----------
const SSR_DIR = path.join(root, '.kb-ssr')
execSync(`npx vite build --ssr src/entry-server.jsx --outDir ${SSR_DIR} --emptyOutDir --logLevel error`, { stdio: 'inherit' })
globalThis.__KB_EXPAND_ALL__ = true // render every FAQ answer, not just the open one
const ssr = await import(pathToFileURL(path.join(SSR_DIR, 'entry-server.js')).href)
const { render, pageRoutes, serviceRoutes, localRoutes } = ssr

const indexSrc = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const homeMeta = {
    title: (indexSrc.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim() || 'Pierre Concierge Nursing',
    description: (indexSrc.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '',
}
const routes = [
    { path: '/', ...homeMeta },
    ...pageRoutes, ...serviceRoutes, ...localRoutes,
]

// ---------- 2. HTML to Markdown ----------
const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*' })
td.use(gfm)
td.addRule('keepAltText', {
    filter: 'img',
    replacement: (_c, node) => {
        const alt = (node.getAttribute('alt') || '').trim()
        return alt ? `\n\n*(Image: ${alt})*\n\n` : ''
    },
})
td.remove(['svg', 'script', 'style', 'video', 'noscript'])

function abs(href) {
    if (!href) return href
    if (href.startsWith('/')) return SITE + href.replace(/\/+$/, '') + (href === '/' ? '' : '')
    return href
}

function htmlToMarkdown(html) {
    const dom = parse(html)
    const main = dom.querySelector('main')
    if (!main) return ''
    main.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove())
    main.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href')
        if (href) a.setAttribute('href', abs(href))
    })
    // FAQ question buttons become headings; all other buttons are interface controls and are dropped.
    main.querySelectorAll('button').forEach((b) => {
        const q = b.querySelector('span.font-serif')
        if (q) b.replaceWith(parse(`<h3>${q.text.trim()}</h3>`))
        else b.remove()
    })
    let md = td.turndown(main.innerHTML)
    md = md.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').trim()
    return md
}

// ---------- 3. Routing to files and categories ----------
const POLICY = new Set(['/privacy-practices', '/accessibility'])
function place(route) {
    if (route === '/') return { file: 'pages/home.md', category: 'page' }
    const parts = route.replace(/^\//, '').split('/')
    if (parts.length === 1) {
        if (POLICY.has(route)) return { file: `policies/${parts[0]}.md`, category: 'policy' }
        if (['services', 'conditions', 'care-settings', 'areas', 'compare', 'paying-for-care'].includes(parts[0]))
            return { file: `${parts[0]}/overview.md`, category: `${parts[0]}-overview` }
        return { file: `pages/${parts[0]}.md`, category: 'page' }
    }
    return { file: `${parts[0]}/${parts[1]}.md`, category: parts[0] }
}

// ---------- 4. Build documents ----------
const esc = (s) => (s || '').replace(/"/g, '\\"')
const docs = []
for (const r of routes) {
    const body = htmlToMarkdown(render(r.path))
    const { file, category } = place(r.path)
    const url = SITE + (r.path === '/' ? '/' : r.path)
    docs.push({ file, category, url, route: r.path, title: r.title.replace(/&amp;/g, '&'), description: r.description, body })
}

// Static printable resources (standalone HTML files in public/)
const STATIC_PRINTABLES = [
    { file: 'going-home-checklist', fallback: 'Going Home Checklist', description: 'Printable checklist for the first days at home after a hospital stay.' },
    { file: 'discharge-readiness-kit', fallback: 'Discharge Readiness Kit', description: 'Printable kit for hospital discharge: questions, medication list, home setup, recovery log, warning signs, and contacts.' },
]
let printableCount = 0
for (const s of STATIC_PRINTABLES) {
    const pth = path.join(root, 'public', `${s.file}.html`)
    if (!fs.existsSync(pth)) continue
    printableCount++
    const dom = parse(fs.readFileSync(pth, 'utf8'))
    dom.querySelectorAll('script,style,button').forEach((n) => n.remove())
    const bodyNode = dom.querySelector('body') || dom
    const body = td.turndown(bodyNode.innerHTML).replace(/\n{3,}/g, '\n\n').trim()
    docs.push({
        file: `resources/${s.file}.md`, category: 'resource', url: `${SITE}/${s.file}.html`,
        route: `/${s.file}.html`, title: (dom.querySelector('title')?.text || s.fallback).trim(),
        description: s.description, body,
    })
}

// Site-wide contact and business facts, taken from the footer and the contact page.
const full = parse(render('/'))
const footer = full.querySelector('footer')
if (footer) {
    footer.querySelectorAll('a').forEach((a) => { const h = a.getAttribute('href'); if (h) a.setAttribute('href', abs(h)) })
    footer.querySelectorAll('svg,button').forEach((n) => n.remove())
    // The "Explore" block only repeats site navigation, so it is left out.
    footer.querySelectorAll('h4').forEach((h) => { if (/explore/i.test(h.text)) { h.nextElementSibling?.remove(); h.remove() } })
    const body = td.turndown(footer.innerHTML).replace(/\n{3,}/g, '\n\n').trim()
    docs.push({
        file: 'pages/site-info.md', category: 'site-info', url: `${SITE}/`, route: '(footer)',
        title: 'Site-wide information (footer)', description: 'Contact details, hours, service area, and notices that appear in the footer of every page.', body,
    })
}

// ---------- 5. Incremental write ----------
const manifestPath = path.join(KB, 'metadata', 'manifest.json')
const prev = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : { documents: [] }
const prevByFile = new Map(prev.documents.map((d) => [d.file, d]))
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16)

const changed = [], unchanged = [], created = []
const manifest = []
for (const d of docs) {
    const h = hash(`${d.title}\n${d.description}\n${d.url}\n${d.body}`)
    const old = prevByFile.get(d.file)
    const extracted = old && old.hash === h ? old.extracted : TODAY
    const fm = [
        '---',
        `title: "${esc(d.title)}"`,
        `source_url: ${d.url}`,
        `description: "${esc(d.description)}"`,
        `category: ${d.category}`,
        `business: Pierre Concierge Nursing`,
        `location: Ocala and Marion County, Florida`,
        `last_extracted: ${extracted}`,
        `content_hash: ${h}`,
        '---',
        '',
    ].join('\n')
    const text = `${fm}\n# ${d.title}\n\n> Source: ${d.url}\n\n${d.body}\n`
    const out = path.join(KB, d.file)
    if (!old) created.push(d.file)
    else if (old.hash !== h) changed.push(d.file)
    else unchanged.push(d.file)
    if (!old || old.hash !== h || !fs.existsSync(out)) {
        fs.mkdirSync(path.dirname(out), { recursive: true })
        fs.writeFileSync(out, text)
    }
    manifest.push({ file: d.file, title: d.title, source_url: d.url, route: d.route, category: d.category, extracted, hash: h, words: d.body.split(/\s+/).filter(Boolean).length })
}
// Remove files for pages that no longer exist
const removed = []
const keep = new Set(manifest.map((m) => m.file))
for (const o of prev.documents) {
    if (!keep.has(o.file)) {
        fs.rmSync(path.join(KB, o.file), { force: true })
        removed.push(o.file)
    }
}

fs.mkdirSync(path.join(KB, 'metadata'), { recursive: true })
fs.writeFileSync(manifestPath, JSON.stringify({ generated: TODAY, site: SITE, count: manifest.length, documents: manifest }, null, 2) + '\n')

// ---------- 6. sitemap.md ----------
const byCat = {}
for (const m of manifest) (byCat[m.category] ||= []).push(m)
let sm = `# Knowledge base sitemap\n\nEvery page of ${SITE} and the Markdown file that holds its content.\n\nLast updated: ${TODAY}. Documents: ${manifest.length}.\n`
for (const cat of Object.keys(byCat).sort()) {
    sm += `\n## ${cat}\n\n| Page | URL | File |\n| --- | --- | --- |\n`
    for (const m of byCat[cat]) sm += `| ${m.title.replace(/\|/g, '/')} | ${m.source_url} | \`${m.file}\` |\n`
}
fs.writeFileSync(path.join(KB, 'sitemap.md'), sm)

// ---------- 7. Validation ----------
const report = { generated: TODAY, routes_expected: routes.length + printableCount, documents_written: manifest.length, problems: [], checks: {} }
for (const r of routes) if (!keep.has(place(r.path).file)) report.problems.push(`missing file for ${r.path}`)
for (const m of manifest) if (m.words < 40) report.problems.push(`very short document: ${m.file} (${m.words} words)`)
const corpus = docs.map((d) => d.body).join('\n')
const facts = {
    phone: '(754) 367-6929', hours: 'Monday', per_visit_price: '$150', monthly_plan: '$450',
    service_area: 'Marion County', emergency_911: '911', private_pay: 'private pay', physician_order: "doctor's order",
}
for (const [k, v] of Object.entries(facts)) {
    const ok = corpus.toLowerCase().includes(v.toLowerCase()) || corpus.toLowerCase().includes(v.replace("'", '’').toLowerCase())
    report.checks[k] = ok
    if (!ok) report.problems.push(`expected fact not found in knowledge base: ${k} (${v})`)
}
fs.writeFileSync(path.join(KB, 'metadata', 'validation-report.json'), JSON.stringify(report, null, 2) + '\n')

fs.rmSync(SSR_DIR, { recursive: true, force: true })
console.log(`knowledge base: ${manifest.length} documents | new ${created.length}, changed ${changed.length}, unchanged ${unchanged.length}, removed ${removed.length}`)
if (report.problems.length) { console.log('PROBLEMS:'); report.problems.forEach((p) => console.log(' -', p)) } else console.log('validation: all checks passed')
