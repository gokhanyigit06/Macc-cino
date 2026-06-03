// routes/localize.js
// Swap translatable fields on a DB row to the requested language, falling back
// to the base (Turkish) value when a translation is empty/missing.
function normLang(q) {
  const l = String(q || '').toLowerCase();
  return (l === 'de' || l === 'en') ? l : 'tr';
}

function localizeRow(row, lang, fields) {
  if (!row || (lang !== 'de' && lang !== 'en')) return row;
  const out = { ...row };
  for (const f of fields) {
    const t = row[f + '_' + lang];
    if (t != null && String(t).trim() !== '') out[f] = t;
  }
  return out;
}

const localizeMany = (rows, lang, fields) => rows.map((r) => localizeRow(r, lang, fields));

// Build a Prisma `data` patch for the translation columns from a request body.
// Only includes keys actually present so PATCH-style partial updates work.
function translationData(body, fields) {
  const data = {};
  for (const f of fields) {
    for (const lang of ['de', 'en']) {
      const key = f + '_' + lang;
      if (body[key] !== undefined) data[key] = body[key] || null;
    }
  }
  return data;
}

module.exports = { normLang, localizeRow, localizeMany, translationData };
