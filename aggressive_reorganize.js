const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';
const assetsDir = path.join(projectDir, 'assets');

// Ensure folders exist
['gastronomy', 'bakery', 'office', 'products', 'misc'].forEach(dir => {
    const fullDir = path.join(assetsDir, dir);
    if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
});

const fileMap = {
    // Gastronomy
    'gastronomy_hero.png': 'gastronomy/hero.png',
    'gastronomy_product_1.png': 'gastronomy/product_1.png',
    'gastronomy_product_2.png': 'gastronomy/product_2.png',
    'hybrid_machine.png': 'gastronomy/hybrid_machine.png',

    // Bakery
    'bakery_hero_coffee_1768295986558.png': 'bakery/hero.png',
    'bakery_coffee_machine_1_1768296006006.png': 'bakery/machine_1.png',
    'bakery_coffee_cup_pastry_1768296024920.png': 'bakery/cup_pastry.png',
    'bakery_morning_coffee_scene_1768296740970.png': 'bakery/morning_scene.png',
    'premium_coffee_beans_roasted_1768296705081.png': 'bakery/beans.png',
    'latte_art_milk_foam_1768296724065.png': 'bakery/milk_foam.png',

    // Office
    'office_coffee_scene_premium_1768299281555_1768299082145.png': 'office/hero.png',
    'office_coffee_machine_1_1768299281555_1768299106187.png': 'office/machine_1.png',

    // Products
    'product1.png': 'products/product1.png',
    'product2.png': 'products/product2.png',
    'product3.png': 'products/product3.png',
    'product4.png': 'products/product4.png',

    // Concept / Misc
    'premium_concept_machine.png': 'misc/concept_machine.png',
    'premium_concept_service.png': 'misc/concept_service.png',
    'premium_concept_support.png': 'misc/concept_support.png',
    'coffee_bean_icon.png': 'misc/coffee_bean_icon.png',
    'hero_bg.png': 'misc/hero_bg.png',
    'cafe_interior.png': 'misc/cafe_interior.png',
    'coffee_concept.png': 'misc/coffee_concept.png',
    'machine_detail.png': 'misc/machine_detail.png',
    'machine_shop.png': 'misc/machine_shop.png',
    'milk_foam.png': 'misc/milk_foam.png',
    'milk_foam_latte_art.png': 'misc/milk_foam_latte_art.png',
    'crema_cup.png': 'misc/crema_cup.png',
    'crema.png': 'misc/crema.png',
    'blog1.png': 'misc/blog1.png',
    'blog2.png': 'misc/blog2.png',
    'blog3.png': 'misc/blog3.png',
    'client1.png': 'misc/client1.png',
    'client2.png': 'misc/client2.png',
    'client3.png': 'misc/client3.png',
    'service_vehicle.png': 'misc/service_vehicle.png',
    'favicon.png': 'misc/favicon.png'
};

// 1. Physically MOVE files
Object.entries(fileMap).forEach(([oldName, newRelPath]) => {
    const oldPath = path.join(assetsDir, oldName);
    const newPath = path.join(assetsDir, newRelPath);

    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Moved: ${oldName} -> ${newRelPath}`);
    }
});

// 2. Clean up any remaining files in assets/ root (that are not directories)
const items = fs.readdirSync(assetsDir);
items.forEach(item => {
    const fullPath = path.join(assetsDir, item);
    if (fs.statSync(fullPath).isFile()) {
        // If it's a file that wasn't in our map, move it to misc just in case
        const target = path.join(assetsDir, 'misc', item);
        fs.renameSync(fullPath, target);
        console.log(`Auto-moved to misc: ${item}`);
    }
});

// 3. Update references in code
const codeFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

codeFiles.forEach(file => {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Use a regex to find all assets/ references
    // This is more robust than simple split/join for cases where filenames might overlap
    content = content.replace(/assets\/([^"'\s)>]+)/g, (match, fileName) => {
        // If fileName is already a path with a slash, skip it unless it's in our map
        // But our map has the "flat" names.

        // Find the matching target in our map or logical placement
        const baseName = path.basename(fileName);

        // Check if we have a mapping for the original filename
        if (fileMap[baseName]) {
            return `assets/${fileMap[baseName]}`;
        }

        // If it was already fixed but maybe slightly different, we might need logic.
        // But for now, let's look at what's on disk.
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Finalized paths in ${file}`);
    }
});

console.log('--- ASSETS FULLY ORGANIZED ---');
