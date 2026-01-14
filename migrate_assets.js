const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';
const assetsDir = path.join(projectDir, 'assets');
const brainDir = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\ffca89f1-9f5e-442c-9edf-969f2eb73cc5';

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

const htmlFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

const pathRegex = /C:\/Users\/PC\/\.gemini\/antigravity\/brain\/ffca89f1-9f5e-442c-9edf-969f2eb73cc5\/([^'"]+)/g;

htmlFiles.forEach(file => {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    let match;
    // We need to reset the regex lastIndex because of the global flag
    pathRegex.lastIndex = 0;

    while ((match = pathRegex.exec(content)) !== null) {
        const fullPath = match[0];
        const fileName = match[1];
        const sourcePath = path.join(brainDir, fileName);
        const destPath = path.join(assetsDir, fileName);

        if (fs.existsSync(sourcePath)) {
            try {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`Copied ${fileName} to assets/`);
                content = content.split(fullPath).join(`assets/${fileName}`);
                modified = true;
            } catch (err) {
                console.error(`Error copying ${fileName}:`, err);
            }
        } else {
            console.warn(`Source file not found: ${sourcePath}`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated paths in ${file}`);
    }
});

console.log('--- ASSET MIGRATION COMPLETE ---');
