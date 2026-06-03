// i18n/render.js
// Server-side translation of the Turkish source HTML into DE/EN on the fly.
// Single source of truth = the existing TR files in /public. For /de and /en
// requests we load the same source, translate text + attributes from the
// locale dictionary, rewrite internal links/assets, and inject SEO hreflang
// tags. Rendered output is cached in memory and invalidated by file mtime.
const fs = require('fs');
const path = require('path');
const { cheerio, normalize, isTranslatable, walkTextNodes, walkAttrs } = require('./core');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const LOCALES_DIR = path.join(PUBLIC_DIR, 'locales');
const SUPPORTED = ['de', 'en'];          // tr is the default, served from root
const ALL_LANGS = ['tr', 'de', 'en'];

// ---- locale dictionaries (mtime-cached) ----
const dictCache = {};
function loadDict(lang) {
  const file = path.join(LOCALES_DIR, lang + '.json');
  try {
    const mtime = fs.statSync(file).mtimeMs;
    const c = dictCache[lang];
    if (c && c.mtime === mtime) return c.data;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    dictCache[lang] = { mtime, data };
    return data;
  } catch (_) {
    return {};
  }
}

// ---- URL rewriting helpers ----
const ASSET_RE = /^(assets|js|uploads|components)\//i;
const ASSET_EXT_RE = /\.(css|js|png|jpe?g|gif|svg|webp|ico|mp4|webm|woff2?|ttf|eot|pdf)(\?.*)?$/i;
function isAssetUrl(v) { return ASSET_RE.test(v) || ASSET_EXT_RE.test(v); }
function isExternalOrSpecial(v) {
  return !v || /^(#|https?:|\/\/|mailto:|tel:|data:|javascript:)/i.test(v);
}

function rewriteUrl(v, lang, isAnchorHref) {
  if (isExternalOrSpecial(v)) return v;
  if (v.startsWith('/')) return v;                 // already root-absolute (e.g. /api)
  if (isAssetUrl(v)) return '/' + v;               // assets are language-agnostic
  if (isAnchorHref) return '/' + lang + '/' + v;   // internal page link
  return '/' + v;
}

function rewriteStyleUrls(css, lang) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, q, u) => {
    if (isExternalOrSpecial(u) || u.startsWith('/')) return m;
    return `url(${q}/${u.replace(/^\.?\//, '')}${q})`;
  });
}

function rewriteLinks($, lang) {
  $('a[href]').each((_, el) => $(el).attr('href', rewriteUrl($(el).attr('href'), lang, true)));
  const assetAttrs = [['link', 'href'], ['script', 'src'], ['img', 'src'],
    ['source', 'src'], ['video', 'src'], ['video', 'poster'], ['iframe', 'src'],
    ['form', 'action'], ['img', 'data-src']];
  for (const [tag, attr] of assetAttrs) {
    $(`${tag}[${attr}]`).each((_, el) => {
      const cur = $(el).attr(attr);
      if (cur != null) $(el).attr(attr, rewriteUrl(cur, lang, false));
    });
  }
  $('[style]').each((_, el) => {
    const s = $(el).attr('style');
    if (s && s.includes('url(')) $(el).attr('style', rewriteStyleUrls(s, lang));
  });
  $('style').each((_, el) => {
    const node = el.children && el.children[0];
    if (node && node.data && node.data.includes('url(')) node.data = rewriteStyleUrls(node.data, lang);
  });
}

function translateDoc(html, lang, relSlug) {
  const dict = loadDict(lang);
  const isFragment = !/<html[\s>]/i.test(html);
  const $ = cheerio.load(html, { decodeEntities: false });

  // 1) Text nodes. Preserve the node's leading/trailing whitespace (it affects
  // inline layout) and swap only the meaningful core.
  walkTextNodes($, $.root()[0], (raw, set) => {
    const key = normalize(raw);
    if (!isTranslatable(key)) return;
    const tr = dict[key];
    if (!tr) return;
    const lead = (raw.match(/^\s*/) || [''])[0];
    const trail = (raw.match(/\s*$/) || [''])[0];
    set(lead + tr + trail);
  });

  // 2) Attributes
  walkAttrs($, (raw, set) => {
    const key = normalize(raw);
    if (!isTranslatable(key)) return;
    const tr = dict[key];
    if (tr) set(tr);
  });

  // Fragments (header/footer components) are injected via innerHTML — return
  // just the translated markup, no <html>/<head> wrapper or SEO tags.
  if (isFragment) {
    rewriteLinks($, lang);
    return $('body').html();
  }

  // 3) <html lang>
  $('html').attr('lang', lang).attr('data-lang', lang);

  // 4) Link / asset rewriting
  rewriteLinks($, lang);

  // 5) SEO: hreflang alternates + canonical, and client lang hints
  const head = $('head');
  if (head.length) {
    const base = relSlug ? '/' + relSlug : '/';
    const altFor = (l) => l === 'tr' ? base : '/' + l + (relSlug ? '/' + relSlug : '/');
    head.find('link[rel="alternate"][hreflang], link[rel="canonical"]').remove();
    let tags = '';
    for (const l of ALL_LANGS) tags += `\n  <link rel="alternate" hreflang="${l}" href="${altFor(l)}">`;
    tags += `\n  <link rel="alternate" hreflang="x-default" href="${base}">`;
    tags += `\n  <link rel="canonical" href="${altFor(lang)}">`;
    tags += `\n  <script>window.__LANG__=${JSON.stringify(lang)};window.__I18N_PREFIX__=${JSON.stringify('/' + lang)};</script>`;
    head.prepend(tags);
  }

  return $.html();
}

// ---- render cache (keyed by lang:relpath, invalidated by src+locale mtime) ----
const renderCache = {};
function renderFile(absFile, lang, relSlug) {
  const srcMtime = fs.statSync(absFile).mtimeMs;
  const dictFile = path.join(LOCALES_DIR, lang + '.json');
  let dictMtime = 0; try { dictMtime = fs.statSync(dictFile).mtimeMs; } catch (_) {}
  const cacheKey = lang + ':' + absFile;
  const c = renderCache[cacheKey];
  if (c && c.srcMtime === srcMtime && c.dictMtime === dictMtime) return c.html;
  const html = translateDoc(fs.readFileSync(absFile, 'utf8'), lang, relSlug);
  renderCache[cacheKey] = { srcMtime, dictMtime, html };
  return html;
}

// Resolve a stripped (no-lang) request path to a source .html file in /public.
function resolveSourceFile(relPath) {
  let p = relPath.replace(/^\/+/, '');           // strip leading slashes
  if (p === '' || p === '/') p = 'index';
  if (p.endsWith('/')) p = p + 'index';
  let candidate = p.endsWith('.html') ? p : p + '.html';
  const abs = path.join(PUBLIC_DIR, candidate);
  // prevent path traversal
  if (!abs.startsWith(PUBLIC_DIR)) return null;
  return fs.existsSync(abs) ? { abs, slug: p.replace(/\.html$/, '') } : null;
}

// Express middleware. Handles /de/* and /en/* by translating the matching
// TR source page; everything else (including the TR root) falls through.
function middleware(req, res, next) {
  const m = req.path.match(/^\/(de|en)(\/.*)?$/);
  if (!m) return next();
  const lang = m[1];
  if (!SUPPORTED.includes(lang)) return next();
  const rest = m[2] || '/';
  // Don't translate the admin SPA or API under a lang prefix
  if (/^\/(admin|api)(\/|$)/.test(rest)) return next();
  const resolved = resolveSourceFile(rest);
  if (!resolved) return next();
  try {
    const html = renderFile(resolved.abs, lang, resolved.slug === 'index' ? '' : resolved.slug);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (e) {
    console.error('i18n render error:', e);
    return next();
  }
}

module.exports = { middleware, translateDoc, SUPPORTED, ALL_LANGS };
