// Homepage product grid: hydrates #home-product-grid from /api/products.
// Respects the `products_section_visible` settings flag — when "false",
// the entire #makineler section is removed.
(function () {
    function escapeAttr(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    const T = (s) => (window.I18N ? window.I18N.t(s) : s);
    const API = (p) => (window.I18N ? window.I18N.apiUrl(p) : p);

    async function init() {
        const section = document.getElementById('makineler');
        const grid = document.getElementById('home-product-grid');
        if (!section || !grid) return;
        if (window.I18N && window.I18N.ready) { try { await window.I18N.ready; } catch (_) {} }

        // Check section visibility flag first
        try {
            const sRes = await fetch('/api/settings');
            if (sRes.ok) {
                const settings = await sRes.json();
                if (settings.products_section_visible === 'false') {
                    section.style.display = 'none';
                    return;
                }
            }
        } catch (_) { /* non-fatal */ }

        // Load visible products
        try {
            const res = await fetch(API('/api/products'));
            const products = await res.json();
            if (!Array.isArray(products) || products.length === 0) {
                grid.innerHTML = '<p style="text-align:center; width:100%;">' + T('Yakında yeni ürünlerimiz eklenecek.') + '</p>';
                return;
            }
            grid.innerHTML = products.map(p => {
                const img = p.imageUrl || 'assets/misc/coffee_bean_icon.png';
                return `
                    <div class="product-card">
                        <img src="${escapeAttr(img)}" alt="${escapeAttr(p.name)}" loading="lazy" width="400" height="400" decoding="async">
                        <div class="product-info">
                            <h3>${escapeHtml(p.name)}</h3>
                            <p>${escapeHtml(p.description).slice(0, 90)}${p.description && p.description.length > 90 ? '...' : ''}</p>
                            <a href="#" class="btn-text open-modal"
                                data-title="${escapeAttr(p.name)}"
                                data-img="${escapeAttr(img)}"
                                data-desc="${escapeAttr(p.description)}">
                                ${escapeHtml(T('İncele'))} <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>`;
            }).join('');

            attachModalDelegation();
        } catch (err) {
            console.error('Home products load failed:', err);
            grid.innerHTML = '<p style="text-align:center; width:100%;">' + T('Ürünler yüklenirken hata oluştu.') + '</p>';
        }
    }

    // script.js attaches its .open-modal handlers at DOMContentLoaded — before
    // our cards exist. Use event delegation so dynamic cards still trigger the modal.
    function attachModalDelegation() {
        const grid = document.getElementById('home-product-grid');
        if (!grid || grid.dataset.modalBound === '1') return;
        grid.dataset.modalBound = '1';
        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.open-modal');
            if (!btn) return;
            e.preventDefault();
            const modal = document.getElementById('productModal');
            if (!modal) return;
            const title = btn.getAttribute('data-title');
            const img = btn.getAttribute('data-img');
            const desc = btn.getAttribute('data-desc');
            const modalTitle = document.getElementById('modalTitle');
            const modalImg = document.getElementById('modalImg');
            const modalDesc = document.getElementById('modalDesc');
            if (modalTitle) modalTitle.textContent = title;
            if (modalImg) modalImg.src = img;
            if (modalDesc) modalDesc.textContent = desc;
            modal.style.display = 'flex';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
