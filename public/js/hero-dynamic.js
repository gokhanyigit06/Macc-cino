// Hero slider: fetches /api/hero/slides and renders <video>/<img> slides.
// If no active slides exist, leaves the static default hero in place.
(function () {
    const SLIDE_INTERVAL_MS = 6000;

    async function loadSlides() {
        try {
            const url = window.I18N ? window.I18N.apiUrl('/api/hero/slides') : '/api/hero/slides';
            const res = await fetch(url);
            if (!res.ok) return;
            const slides = await res.json();
            if (!slides.length) return; // keep default static hero
            renderSlides(slides);
        } catch (err) {
            console.warn('Hero slider load failed, keeping default hero:', err);
        }
    }

    function renderSlides(slides) {
        const container = document.getElementById('hero-slider');
        const defaultBg = document.getElementById('hero-default-bg');
        const defaultContent = document.getElementById('hero-content-default');
        if (!container) return;

        // Hide static fallback once dynamic slides are ready
        if (defaultBg) defaultBg.style.display = 'none';

        container.innerHTML = slides.map((s, i) => {
            const media = s.type === 'video'
                ? `<video autoplay muted loop playsinline preload="auto"><source src="/${s.mediaUrl}"></video>`
                : `<img src="/${s.mediaUrl}" alt="${(s.title || '').replace(/"/g, '&quot;')}">`;
            const captionParts = [];
            if (s.title) captionParts.push(`<h1 class="hero-title">${escapeHtml(s.title)}</h1>`);
            if (s.subtitle) captionParts.push(`<div class="hero-separator"></div><h2 class="hero-subtitle">${escapeHtml(s.subtitle)}</h2>`);
            const caption = captionParts.length
                ? `<div class="container hero-content hero-slide-caption">${captionParts.join('')}</div>`
                : '';
            return `<div class="hero-slide${i === 0 ? ' active' : ''}" data-index="${i}">${media}${caption}</div>`;
        }).join('');

        // If any slide carries its own caption, hide the default content block
        const anyCaption = slides.some(s => s.title || s.subtitle);
        if (anyCaption && defaultContent) defaultContent.style.display = 'none';

        if (slides.length > 1) {
            startAutoRotate(container.querySelectorAll('.hero-slide'));
        }
    }

    function startAutoRotate(slideEls) {
        let active = 0;
        setInterval(() => {
            slideEls[active].classList.remove('active');
            active = (active + 1) % slideEls.length;
            slideEls[active].classList.add('active');
        }, SLIDE_INTERVAL_MS);
    }

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSlides);
    } else {
        loadSlides();
    }
})();
