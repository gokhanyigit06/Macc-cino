# i18n (TR · DE · EN)

The site is authored in **Turkish** (the source of truth). German and English are
served from the same source — there are **no duplicated HTML files**.

- **Static page text** is translated **server-side**: requests to `/de/*` and
  `/en/*` are rendered on the fly by `i18n/render.js` (wired in `server.js`),
  which swaps text/attributes from a dictionary, rewrites internal links to keep
  the language prefix, points assets at the root, and injects `hreflang`/canonical.
- **JS-generated strings** (loading/error messages, "İncele", etc.) are translated
  client-side via `public/js/i18n.js` → `window.I18N.t('<Turkish>')`.
- **Dynamic DB content** (products, blog, hero) has `*_de` / `*_en` columns; the
  API localizes on `?lang=de|en` (`routes/localize.js`) and falls back to Turkish.
  Editors fill the DE/EN fields in the admin panel.

URLs: TR = root (`/about`), DE = `/de/about`, EN = `/en/about`. The header language
switcher (`#langSwitcher`, built by `i18n.js`) links the equivalent page per language.

## Files
| File | Purpose |
|------|---------|
| `core.js` | Shared rules: which text/attrs are translatable + `normalize()` |
| `extract.js` | Scans `public/**/*.html` → `strings.tr.json` (unique TR strings) |
| `*.map.*.json` | Hand/AI translations keyed by exact TR string (DE & EN) |
| `*.ui.json` | Translations for JS-generated strings (not in the HTML) |
| `*.map.fix.json` | Manual overrides for keys with stray encoding bytes |
| `build-locale.js` | Merges maps+ui → `public/locales/{de,en}.json` (runtime dicts) |
| `render.js` | Express middleware: server-side DE/EN rendering + link rewrite + SEO |
| `seo.js` | One-off: inject hreflang into TR pages, write `sitemap.xml`/`robots.txt` |
| `GLOSSARY.md` | Terminology + rules used when translating |

## Adding / changing static text
1. Edit the Turkish HTML in `public/`.
2. `node i18n/extract.js` — refresh `strings.tr.json`.
3. Add the new TR→DE / TR→EN entries to a `de.map.*.json` / `en.map.*.json`
   (key = exact Turkish string).
4. `node i18n/build-locale.js` — rebuild `public/locales/*.json` (reports coverage
   and flags map keys that don't match the source).
5. New page? `node i18n/seo.js` to refresh hreflang + sitemap. Set `SITE_URL` env
   to the production domain (default `https://www.macc-cino.com`).

The runtime caches rendered pages by source+locale mtime, so editing a locale file
or a page is picked up on the next request without a restart.
