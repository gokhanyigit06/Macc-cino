const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';
const assetsDir = path.join(projectDir, 'assets');
const brainDir = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\ffca89f1-9f5e-442c-9edf-969f2eb73cc5';

// 1. Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// 2. Function to scan all files
const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // A very broad regex to find ANY mention of C:/Users/PC or Ci:/Users/PC or just .gemini path
    // It captures up to the end of the filename (png, jpg, etc.)
    const pathRegex = /(?:[A-Za-z]i?[:/]+Users\/[^\s'"]+\.(?:png|jpg|jpeg|gif|svg|webp))/gi;

    content = content.replace(pathRegex, (match) => {
        const fileName = path.basename(match);
        const sourcePath = path.join(brainDir, fileName);
        const destPath = path.join(assetsDir, fileName);

        if (fs.existsSync(sourcePath)) {
            try {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`[${file}] Copied and fixed: ${fileName}`);
            } catch (e) {
                console.error(`[${file}] Error copying ${fileName}: ${e.message}`);
            }
        } else {
            console.warn(`[${file}] Warning: ${fileName} not found in brain folder.`);
        }
        return `assets/${fileName}`;
    });

    // Also catch broken relative links that might have escaped previous fixes
    // For example, images starting with /assets/ (absolute from root) vs assets/
    content = content.replace(/src=["']\/assets\//g, 'src="assets/');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[${file}] SAVED CHANGES`);
    } else {
        console.log(`[${file}] No broken paths found.`);
    }
});

console.log('--- DEEP IMAGE FIX COMPLETE ---');
