// Sector page product showcase hydrator.
//
// Usage: place a container like
//   <div data-products-section data-sector="hotel" data-hide-when-empty="true">
//     <template data-card-template>
//       <div class="product-card" ...>
//         <img data-field="img" src="..." alt="">
//         <h4 data-field="name">Default</h4>
//         <p data-field="desc">Default</p>
//       </div>
//     </template>
//   </div>
//
// Inside the template, child elements with `data-field="name|desc|img"` get
// their content/src replaced per product. The template node is cloned once
// per matching product and appended to the container.
//
// If the global "products_section_visible" setting is "false", or
// `data-hide-when-empty` is set and no products match, the entire container
// (or its closest [data-products-wrapper] / <section>) is hidden.
(function () {
    async function init() {
        const containers = document.querySelectorAll('[data-products-section]');
        if (!containers.length) return;

        const API = (p) => (window.I18N ? window.I18N.apiUrl(p) : p);
        const [settings, allProducts] = await Promise.all([
            fetch('/api/settings').then(r => r.ok ? r.json() : {}).catch(() => ({})),
            fetch(API('/api/products')).then(r => r.ok ? r.json() : []).catch(() => [])
        ]);

        const globallyHidden = settings.products_section_visible === 'false';

        containers.forEach(container => {
            const sector = (container.dataset.sector || '').toLowerCase().trim();
            const wrapper = container.closest('[data-products-wrapper]')
                || container.closest('section')
                || container;

            if (globallyHidden) {
                wrapper.style.display = 'none';
                return;
            }

            const matches = allProducts.filter(p => {
                if (!p.sectors) return false;
                return p.sectors.split(',').map(s => s.trim().toLowerCase()).includes(sector);
            });

            const template = container.querySelector('template[data-card-template]');
            if (!template) {
                console.warn('[sector-products] no template found in', container);
                return;
            }

            if (matches.length === 0) {
                // No products for this sector: hide section unless opt-in
                if (container.dataset.hideWhenEmpty !== 'false') {
                    wrapper.style.display = 'none';
                }
                return;
            }

            // Remove any old cards (everything except the template itself)
            Array.from(container.children).forEach(child => {
                if (child.tagName !== 'TEMPLATE') child.remove();
            });

            const frag = document.createDocumentFragment();
            matches.forEach(product => {
                const clone = template.content.cloneNode(true);

                clone.querySelectorAll('[data-field]').forEach(el => {
                    const field = el.dataset.field;
                    // Aliases: img -> imageUrl, desc -> description
                    const key = field === 'img' ? 'imageUrl' : field === 'desc' ? 'description' : field;
                    const value = product[key];
                    if (value == null || value === '') return;
                    if (el.tagName === 'IMG') {
                        el.src = value;
                        el.alt = product.name || '';
                    } else {
                        el.textContent = value;
                    }
                });

                // Optionally wire up a CTA link with title/desc
                clone.querySelectorAll('[data-action="open-modal"]').forEach(el => {
                    el.setAttribute('data-title', product.name || '');
                    el.setAttribute('data-img', product.imageUrl || '');
                    el.setAttribute('data-desc', product.description || '');
                });

                frag.appendChild(clone);
            });
            container.appendChild(frag);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
