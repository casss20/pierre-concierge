# Pierre Concierge Nursing knowledge base

Markdown copy of every page of https://pierre-concierge.vercel.app, built for a RAG (retrieval) system so an AI assistant can answer visitors' questions from the website's own content.

Pierre Concierge Nursing is a private pay, mobile Registered Nurse service in Ocala and Marion County, Florida, run by Elda Marie Pierre, RN, BSN. Phone: (754) 367-6929.

## Layout

| Folder or file | What it holds |
| --- | --- |
| `pages/` | Home, About, Pricing, FAQ, How It Works, Contact, Our Values, Resources, and `site-info.md` (footer facts) |
| `services/` | The 10 services plus an overview |
| `conditions/` | Condition pages (diabetes, heart failure, COPD, and others) |
| `care-settings/` | Home, after a hospital stay, visitors and travelers |
| `areas/` | Ocala and nearby towns |
| `compare/` | Plain language comparisons of care options |
| `paying-for-care/` | Private pay, Medicare, long term care insurance, veterans benefits |
| `policies/` | HIPAA Notice of Privacy Practices and the accessibility statement |
| `resources/` | The printable Going Home Checklist |
| `sitemap.md` | Every URL and the file that holds it |
| `metadata/manifest.json` | Title, URL, category, extraction date, content hash, and word count for every file |
| `metadata/validation-report.json` | Result of the automatic completeness checks |
| `metadata/content-notes.md` | Places where the website contradicts itself. Read before going live |
| `AGENT_GUIDE.md` | Rules and a ready to use system prompt for the AI assistant |

## File format

Each file starts with YAML front matter (`title`, `source_url`, `description`, `category`, `business`, `location`, `last_extracted`, `content_hash`), then a `#` title, a `> Source:` line, and the page content under `##` and `###` headings. Each `##` section is written to stand on its own, so splitting on headings keeps each chunk meaningful. FAQ questions are `###` headings with the answer directly below.

## Keeping it up to date

```
npm run kb
```

This renders every page with the website's own code and rewrites only the files whose content changed. Unchanged files keep their old `last_extracted` date. Files for deleted pages are removed. It prints how many files were new, changed, unchanged, and removed. Re-embed only the changed files.

Run `npm run kb` after any content change, then commit the `knowledge-base/` folder.

## What is not included

- Images and videos are not described, except for their alt text.
- The booking form is an interface and holds no content.
- Nothing from outside the website.
