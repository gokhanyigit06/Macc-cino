// i18n/extract.js
// Walks all public HTML (pages + shared components) and collects every
// user-facing Turkish string (text nodes + whitelisted attributes) into a
// flat skeleton: { "<TR string>": "" } ready for DE/EN translation.
// TR is the source language, so the keys ARE the Turkish text.
//
// Usage: node i18n/extract.js  ->  writes i18n/strings.tr.json
const fs = require('fs');
const path = require('path');
const { cheerio, normalize, isTranslatable, walkTextNodes, walkAttrs } = require('./core');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const strings = new Set();

function record(raw) {
  const s = normalize(raw);
  if (isTranslatable(s)) strings.add(s);
}

function processFile(file) {
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'), { decodeEntities: false });
  walkTextNodes($, $.root()[0], (raw) => record(raw));
  walkAttrs($, (raw) => record(raw));
}

const files = [];
for (const f of fs.readdirSync(PUBLIC_DIR)) {
  if (f.endsWith('.html')) files.push(path.join(PUBLIC_DIR, f));
}
const compDir = path.join(PUBLIC_DIR, 'components');
for (const f of fs.readdirSync(compDir)) {
  if (f.endsWith('.html')) files.push(path.join(compDir, f));
}
files.forEach(processFile);

const sorted = Array.from(strings).sort((a, b) => a.localeCompare(b, 'tr'));
const out = {};
sorted.forEach((s) => { out[s] = ''; });
fs.writeFileSync(path.join(__dirname, 'strings.tr.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(`Extracted ${sorted.length} unique strings from ${files.length} files.`);
