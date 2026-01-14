const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';
const assetsDir = path.join(projectDir, 'assets');

if (!fs.existsSync(assetsDir)) {
    console.error('Assets dir not found');
    process.exit(1);
}

const assetsFiles = fs.readdirSync(assetsDir);
const assetMap = {};
assetsFiles.forEach(f => {
    assetMap[f.toLowerCase()] = f;
});

const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Regex to find assets/something.ext
    const assetRefRegex = /assets\/([^/ \s'"]+\.[a-z0-9]+)/gi;

    content = content.replace(assetRefRegex, (match, fileName) => {
        const lowerName = fileName.toLowerCase();
        if (assetMap[lowerName]) {
            if (assetMap[lowerName] !== fileName) {
                console.log(`[${file}] Correcting case: ${fileName} -> ${assetMap[lowerName]}`);
                return `assets/${assetMap[lowerName]}`;
            }
        } else {
            console.warn(`[${file}] Asset NOT found on disk: ${fileName}`);
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[${file}] Updated case sensitivity.`);
    }
});

console.log('--- CASE SENSITIVITY FIX COMPLETE ---');
