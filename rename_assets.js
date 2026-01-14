const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';
const assetsDir = path.join(projectDir, 'assets');
const brainDir = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\ffca89f1-9f5e-442c-9edf-969f2eb73cc5';

const renames = {
    'gastronomy_hero_machine_1768294236899.png': 'gastronomy_hero.png',
    'gastronomy_product_1_1768294251421.png': 'gastronomy_product_1.png',
    'gastronomy_product_2_1768294266220.png': 'gastronomy_product_2.png',
    'hybrid_coffee_machine_modern_1768295132491.png': 'hybrid_machine.png',
    'latte_art_milk_foam_1768296724065.png': 'latte_art_milk_foam.png', // Just in case
    'milk_foam_latte_art_1768295119452.png': 'milk_foam_latte_art.png'
};

// 1. Rename files in assets
for (let [oldName, newName] of Object.entries(renames)) {
    const oldPath = path.join(assetsDir, oldName);
    const newPath = path.join(assetsDir, newName);
    if (fs.existsSync(oldPath)) {
        fs.copyFileSync(oldPath, newPath); // Use copy to be safe
        console.log(`Copied ${oldName} to ${newName}`);
    } else {
        // Try brain dir if not in assets
        const brainPath = path.join(brainDir, oldName);
        if (fs.existsSync(brainPath)) {
            fs.copyFileSync(brainPath, newPath);
            console.log(`Pulled ${newName} from brain.`);
        }
    }
}

// 2. Special check for pattern_dots.png
const dotsBrain = path.join(brainDir, 'pattern_dots.png');
if (fs.existsSync(dotsBrain)) {
    fs.copyFileSync(dotsBrain, path.join(assetsDir, 'pattern_dots.png'));
    console.log('Added pattern_dots.png');
}

console.log('--- RENAMING COMPLETE ---');
