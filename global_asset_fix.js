const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';
const assetsDir = path.join(projectDir, 'assets');
const brainDir = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\ffca89f1-9f5e-442c-9edf-969f2eb73cc5';

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file !== '.git' && file !== 'node_modules' && file !== 'assets') {
                processDirectory(fullPath);
            }
        } else if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Regex to find absolute paths (including those starting with Ci: or C: and potentially containing spaces)
            // It looks for things like src="C:/Users/..." or url('C:/Users/...')
            const absPathRegex = /(?:[A-Z]i?:\/Users\/[^\s'"]+\.(?:png|jpg|jpeg|gif|svg|webp))/gi;

            let matches = content.match(absPathRegex);
            if (matches) {
                matches.forEach(match => {
                    // Extract just the filename at the end
                    let fileName = path.basename(match);

                    // The match might have encoded chars or spaces if it was inside a string
                    // But usually basename handles it.

                    const sourcePath = path.join(brainDir, fileName);
                    const destPath = path.join(assetsDir, fileName);

                    if (fs.existsSync(sourcePath)) {
                        fs.copyFileSync(sourcePath, destPath);
                        console.log(`[${file}] Copied: ${fileName}`);
                    } else {
                        // If it's not in the brain dir, maybe it's already in assets but the link is wrong?
                        console.warn(`[${file}] File not found in brain: ${fileName}`);
                    }

                    // Replace the absolute path with relative assets path
                    content = content.split(match).join(`assets/${fileName}`);
                });
            }

            // Also check for the specific pattern the user showed: Ci/Users/PC/...
            const ciPathRegex = /Ci\/Users\/[^\s'"]+\.(?:png|jpg|jpeg|gif|svg|webp)/gi;
            let ciMatches = content.match(ciPathRegex);
            if (ciMatches) {
                ciMatches.forEach(match => {
                    let fileName = path.basename(match);
                    content = content.split(match).join(`assets/${fileName}`);
                    console.log(`[${file}] Fixed Ci: path for ${fileName}`);
                });
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`[${file}] UPDATED`);
            }
        }
    });
}

processDirectory(projectDir);
console.log('--- GLOBAL ASSET FIX COMPLETE ---');
