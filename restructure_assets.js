const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';
const assetsDir = path.join(projectDir, 'assets');

const transformations = [
    // Gastronomy
    { old: 'gastronomy_hero.png', new: 'gastronomy/hero.png' },
    { old: 'gastronomy_product_1.png', new: 'gastronomy/product_1.png' },
    { old: 'gastronomy_product_2.png', new: 'gastronomy/product_2.png' },
    { old: 'hybrid_machine.png', new: 'gastronomy/hybrid_machine.png' },

    // Bakery
    { old: 'bakery_hero_coffee_1768295986558.png', new: 'bakery/hero.png' },
    { old: 'bakery_coffee_machine_1_1768296006006.png', new: 'bakery/machine_1.png' },
    { old: 'bakery_coffee_cup_pastry_1768296024920.png', new: 'bakery/cup_pastry.png' },
    { old: 'bakery_morning_coffee_scene_1768296740970.png', new: 'bakery/morning_scene.png' },

    // Office
    { old: 'office_coffee_scene_premium_1768299281555_1768299082145.png', new: 'office/hero.png' },
    { old: 'office_coffee_machine_1_1768299281555_1768299106187.png', new: 'office/machine_1.png' },

    // Products
    { old: 'product1.png', new: 'products/product1.png' },
    { old: 'product2.png', new: 'products/product2.png' },
    { old: 'product3.png', new: 'products/product3.png' },
    { old: 'product4.png', new: 'products/product4.png' },

    // Common / Icons
    { old: 'coffee_bean_icon.png', new: 'misc/coffee_bean_icon.png' },
    { old: 'hero_bg.png', new: 'misc/hero_bg.png' },
    { old: 'cafe_interior.png', new: 'misc/cafe_interior.png' },
    { old: 'coffee_concept.png', new: 'misc/coffee_concept.png' },
    { old: 'machine_detail.png', new: 'misc/machine_detail.png' },
    { old: 'machine_shop.png', new: 'misc/machine_shop.png' },
    { old: 'milk_foam.png', new: 'misc/milk_foam.png' },
    { old: 'crema_cup.png', new: 'misc/crema_cup.png' },
    { old: 'crema.png', new: 'misc/crema.png' },
    { old: 'blog1.png', new: 'misc/blog1.png' },
    { old: 'blog2.png', new: 'misc/blog2.png' },
    { old: 'blog3.png', new: 'misc/blog3.png' },
    { old: 'client1.png', new: 'misc/client1.png' },
    { old: 'client2.png', new: 'misc/client2.png' },
    { old: 'client3.png', new: 'misc/client3.png' }
];

// 1. Physically move/copy files
transformations.forEach(t => {
    const oldPath = path.join(assetsDir, t.old);
    const newPath = path.join(assetsDir, t.new);
    const newDir = path.dirname(newPath);

    if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
    }

    if (fs.existsSync(oldPath)) {
        fs.copyFileSync(oldPath, newPath);
        console.log(`Structured: ${t.old} -> ${t.new}`);
    }
});

// 2. Update all HTML, CSS, JS files
const projectFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

projectFiles.forEach(file => {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    transformations.forEach(t => {
        // Use regex to replace all occurrences efficiently
        // We look for 'assets/filename' and replace with 'assets/newpath'
        // We match quotes or spaces to ensure we don't accidentally replace parts of long filenames
        const searchStr = `assets/${t.old}`;
        const replaceStr = `assets/${t.new}`;

        // Simple global replacement
        content = content.split(searchStr).join(replaceStr);
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated paths in ${file}`);
    }
});

console.log('--- RESTRUCTURE COMPLETE ---');
