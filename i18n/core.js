// i18n/core.js
// Shared rules for WHICH text in an HTML document is user-facing and
// translatable. Used by both extract.js (collect TR strings) and render.js
// (replace them with DE/EN) so the two stay perfectly aligned.
const cheerio = require('cheerio');

// Attributes whose VALUE is user-facing. NOTE: `value` is intentionally
// excluded — <option value="ariza"> etc. are functional form values, not text.
const ATTR_WHITELIST = ['placeholder', 'title', 'alt', 'aria-label',
  'content', 'data-title', 'data-desc', 'data-text'];
const META_CONTENT_NAMES = ['description', 'keywords'];
const META_CONTENT_PROPS = ['og:title', 'og:description', 'twitter:title', 'twitter:description'];
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'svg']);

function normalize(str) {
  // Some source files contain stray Windows-1252 C1 bytes (e.g. U+0096 en-dash)
  // that render as blanks; treat them as whitespace so keys match cleanly.
  return str.replace(/[-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isTranslatable(str) {
  const s = normalize(str);
  if (s.length < 2) return false;
  if (!/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(s)) return false;       // must contain a letter
  if (/^[\d\s.,:/+\-()]+$/.test(s)) return false;            // pure number/phone
  if (/^[\w.+-]+@[\w.-]+\.\w+$/.test(s)) return false;       // email
  if (/^(https?:)?\/\//i.test(s)) return false;             // url
  if (/^(tel|mailto):/i.test(s)) return false;
  if (/^[\d+]{6,}$/.test(s.replace(/[\s()-]/g, ''))) return false; // phone digits
  if (/^[&|·•—–-]+$/.test(s)) return false;                  // lone symbols
  return true;
}

function attrIsTranslatable(el, attr) {
  const attribs = el.attribs || {};
  if (attribs[attr] == null) return false;
  if (attr === 'content') {
    const name = (attribs.name || '').toLowerCase();
    const prop = (attribs.property || '').toLowerCase();
    if (!META_CONTENT_NAMES.includes(name) && !META_CONTENT_PROPS.includes(prop)) return false;
  }
  return true;
}

// Walk text nodes (skipping SKIP_TAGS subtrees) and call visit(rawText, setText).
function walkTextNodes($, root, visit) {
  function rec(el) {
    if (!el.children) return;
    for (const child of el.children) {
      if (child.type === 'text') {
        visit(child.data, (newText) => { child.data = newText; });
      } else if (child.type === 'tag' && !SKIP_TAGS.has(child.name)) {
        rec(child);
      }
    }
  }
  rec(root);
}

// Walk whitelisted attributes and call visit(rawValue, setValue) for each.
function walkAttrs($, visit) {
  $('*').each((_, el) => {
    if (SKIP_TAGS.has(el.name)) return;
    for (const attr of ATTR_WHITELIST) {
      if (!attrIsTranslatable(el, attr)) continue;
      visit(el.attribs[attr], (newVal) => { $(el).attr(attr, newVal); });
    }
  });
}

module.exports = {
  cheerio, ATTR_WHITELIST, SKIP_TAGS, normalize, isTranslatable,
  walkTextNodes, walkAttrs,
};
