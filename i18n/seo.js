// i18n/seo.js  (one-off generator)
// 1) Injects relative hreflang + canonical alternates into each TR source page
//    <head> (the i18n middleware regenerates these for the /de & /en variants).
// 2) Writes public/sitemap.xml (all pages x tr/de/en) and public/robots.txt.
//
// Adjust BASE_URL to the production domain before deploying.
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.SITE_URL || 'https://www.macc-cino.com';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const LANGS = ['tr', 'de', 'en'];

const pages = fs.readdirSync(PUBLIC_DIR).filter((f) => f.endsWith('.html'));

// slug: index.html -> '' (root), about.html -> 'about'
const slugOf = (file) => (file === 'index.html' ? '' : file.replace(/\.html$/, ''));
const pathFor = (lang, slug) => {
  const tail = slug ? '/' + slug : '/';
  return lang === 'tr' ? (slug ? '/' + slug : '/') : '/' + lang + tail;
};

function injectHreflang() {
  let changed = 0;
  for (const file of pages) {
    const abs = path.join(PUBLIC_DIR, file);
    let html = fs.readFileSync(abs, 'utf8');
    if (html.includes('hreflang=')) continue;          // already injected
    const slug = slugOf(file);
    let tags = '\n';
    for (const l of LANGS) tags += `    <link rel="alternate" hreflang="${l}" href="${pathFor(l, slug)}">\n`;
    tags += `    <link rel="alternate" hreflang="x-default" href="${pathFor('tr', slug)}">\n`;
    tags += `    <link rel="canonical" href="${pathFor('tr', slug)}">\n`;
    if (html.includes('</head>')) {
      html = html.replace('</head>', tags + '</head>');
      fs.writeFileSync(abs, html, 'utf8');
      changed++;
    }
  }
  console.log(`hreflang injected into ${changed} TR pages.`);
}

function writeSitemap() {
  const urls = [];
  for (const file of pages) {
    const slug = slugOf(file);
    const alts = LANGS.map((l) => `      <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}${pathFor(l, slug)}"/>`).join('\n');
    for (const l of LANGS) {
      urls.push(
        `  <url>\n    <loc>${BASE_URL}${pathFor(l, slug)}</loc>\n` +
        alts + '\n' +
        `      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${pathFor('tr', slug)}"/>\n` +
        `  </url>`
      );
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls.join('\n') + `\n</urlset>\n`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log(`sitemap.xml written (${pages.length} pages x ${LANGS.length} langs = ${pages.length * LANGS.length} urls).`);
}

function writeRobots() {
  const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), txt, 'utf8');
  console.log('robots.txt written.');
}

injectHreflang();
writeSitemap();
writeRobots();
