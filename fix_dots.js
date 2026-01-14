const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';
const assetsDir = path.join(projectDir, 'assets', 'misc');
const brainDir = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\ffca89f1-9f5e-442c-9edf-969f2eb73cc5';

// 1. Restore pattern_dots.png
const dotsBrain = path.join(brainDir, 'pattern_dots.png');
const dotsTarget = path.join(assetsDir, 'pattern_dots.png');

if (fs.existsSync(dotsBrain)) {
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
    fs.copyFileSync(dotsBrain, dotsTarget);
    console.log('Restored pattern_dots.png to assets/misc/');
} else {
    console.log('Warning: pattern_dots.png not found in brain.');
}

// 2. Fix references in HTML/CSS
const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.html') || f.endsWith('.css'));

files.forEach(file => {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace assets/pattern_dots.png with assets/misc/pattern_dots.png
    if (content.includes('assets/pattern_dots.png')) {
        content = content.replace(/assets\/pattern_dots\.png/g, 'assets/misc/pattern_dots.png');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated pattern_dots path in ${file}`);
    }
});
