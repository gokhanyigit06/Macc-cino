// public/js/i18n.js
// Client-side i18n helper. The static page text is already translated
// server-side (see i18n/render.js); this powers the language switcher,
// translation of JS-generated strings, and language-aware API calls.
(function () {
  var LANG = window.__LANG__
    || document.documentElement.getAttribute('data-lang')
    || document.documentElement.getAttribute('lang')
    || 'tr';
  if (LANG !== 'de' && LANG !== 'en') LANG = 'tr';
  var PREFIX = LANG === 'tr' ? '' : '/' + LANG;

  var dict = {};
  // Collapse whitespace (and stray C1 control bytes) so JS string keys match
  // the normalized runtime dictionary produced by i18n/build-locale.js.
  function norm(s) {
    s = String(s == null ? '' : s);
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      out += (c >= 0x80 && c <= 0x9F) ? ' ' : s[i];
    }
    return out.replace(/\s+/g, ' ').trim();
  }

  var ready = LANG === 'tr'
    ? Promise.resolve()
    : fetch('/locales/' + LANG + '.json')
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (d) { dict = d || {}; })
        .catch(function () { /* fall back to TR text */ });

  // Translate a Turkish UI string; returns the original if no translation.
  function t(tr) {
    if (LANG === 'tr') return tr;
    var v = dict[norm(tr)];
    return (v != null && v !== '') ? v : tr;
  }

  // Append ?lang= to an API path for non-Turkish so the server localizes rows.
  function apiUrl(path) {
    if (LANG === 'tr') return path;
    return path + (path.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + LANG;
  }

  // Path to the equivalent page in `target` language.
  function langPath(target) {
    var p = location.pathname.replace(/^\/(de|en)(?=\/|$)/, '');
    if (p === '') p = '/';
    return target === 'tr' ? p : '/' + target + (p === '/' ? '/' : p);
  }

  function mountSwitcher() {
    var el = document.getElementById('langSwitcher');
    if (!el) return;
    var langs = [['tr', 'TR'], ['de', 'DE'], ['en', 'EN']];
    el.innerHTML = langs.map(function (pair) {
      var active = pair[0] === LANG ? ' active' : '';
      return '<a href="' + langPath(pair[0]) + '" class="lang-link' + active +
        '" hreflang="' + pair[0] + '">' + pair[1] + '</a>';
    }).join('');
  }

  window.I18N = {
    lang: LANG, prefix: PREFIX, ready: ready,
    t: t, apiUrl: apiUrl, langPath: langPath, mountSwitcher: mountSwitcher
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSwitcher);
  } else {
    mountSwitcher();
  }
})();
