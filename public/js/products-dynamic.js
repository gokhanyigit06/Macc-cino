document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Listen to filter checkboxes
    const checkboxes = document.querySelectorAll('.filter-cb');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', filterProducts);
    });
});

let allProducts = [];

async function loadProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '<div class="loader-content" style="width:100%; text-align:center;"><img src="assets/misc/coffee_bean_icon.png" class="loader-icon"> Yükleniyor...</div>';

    try {
        const res = await fetch('/api/products');
        allProducts = await res.json();

        renderProducts(allProducts);
        // Trigger initial filter in case some are unchecked by default (though strictly they are checked in HTML)
        filterProducts();
    } catch (err) {
        console.error('Error loading products:', err);
        grid.innerHTML = '<p style="text-align:center;">Ürünler yüklenirken bir hata oluştu.</p>';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">Aradığınız kriterlere uygun ürün bulunamadı.</p>';
        return;
    }

    products.forEach(product => {
        // Map backend categories to frontend filter values if needed
        // Backend: "espresso cafe" -> Frontend data-category="espresso cafe"
        // It seems straightforward string matching

        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);

        // Handle potentially missing image
        const imgUrl = product.imageUrl || 'assets/misc/coffee_bean_icon.png';

        card.innerHTML = `
            <img src="${imgUrl}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category-tag">${formatCategory(product.category)}</p>
                <p>${product.description}</p>
                <a href="#" class="btn-text open-modal" 
                    data-title="${product.name}"
                    data-img="${imgUrl}"
                    data-desc="${product.description}"
                    data-features="${product.features || ''}">
                    İncele <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-attach modal listeners since we just replaced the DOM
    attachModalListeners();
}

function formatCategory(cat) {
    // cosmetic formatting: "espresso cafe" -> "Espresso / Kafe"
    if (!cat) return '';
    const map = {
        'espresso cafe': 'Espresso / Kafe',
        'otomatik ofis': 'Otomatik / Ofis',
        'vending otel': 'Vending / Otel'
    };
    return map[cat] || cat;
}

function filterProducts() {
    const checkedFilters = Array.from(document.querySelectorAll('.filter-cb:checked')).map(cb => cb.value);

    // Logic: A product is shown if its category string contains ANY of the checked values? 
    // AND logic between groups?
    // The original HTML had "espresso cafe" etc.
    // Let's assume simplistic matching: if product.category contains any checked filter string.

    // Actually, looking at the HTML:
    // categories: espresso, otomatik, vending
    // sectors: ofis, cafe, otel

    // product data-category="espresso cafe"
    // To show, it must match at least one selected category AND at least one selected sector maybe?
    // Or just simple inclusion.

    const visibleProducts = allProducts.filter(p => {
        const catStr = (p.category || '').toLowerCase();
        // Check if any checked filter is present in the category string
        return checkedFilters.some(filter => catStr.includes(filter));
    });

    renderProducts(visibleProducts);
}

function attachModalListeners() {
    // Existing script.js likely handles this globally, but since we dynamically added elements,
    // we might need to rely on delegation or re-attach.
    // The existing script.js likely uses `document.querySelectorAll('.open-modal')` on load.
    // Since we load later, we need to handle this.

    // Simplest way: Re-use the logic from script.js if possible, or duplicate/extend it here.
    // Let's implement a simple direct handler here to be safe.

    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('productModal');
            document.getElementById('modalTitle').innerText = btn.getAttribute('data-title');
            document.getElementById('modalImg').src = btn.getAttribute('data-img');
            document.getElementById('modalDesc').innerText = btn.getAttribute('data-desc');

            // Features feature
            const features = btn.getAttribute('data-features');
            if (features) {
                const specList = document.querySelector('.modal-specs');
                // clear old
                specList.innerHTML = '';
                features.split(',').forEach(f => {
                    specList.innerHTML += `<li><i class="fas fa-check"></i> ${f.trim()}</li>`;
                });
            }

            modal.style.display = 'block';
        });
    });
}
