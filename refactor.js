const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

let headerHtml = ``;
let footerHtml = ``;

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Extract Header (only from index.html to save it)
    if (file === 'index.html') {
        const headerMatch = content.match(/<!-- Sticky Navbar -->[\s\S]*?<\/nav>/);
        if (headerMatch) {
            headerHtml = headerMatch[0];
            // Change MAC&Cino to Macc & Cino and add font styling
            headerHtml = headerHtml.replace(/MAC&Cino/g, 'Macc & Cino');
            // We'll add the font in style.css or inline. Inline is easier for the logo:
            headerHtml = headerHtml.replace(/class="logo"/g, 'class="logo" style="font-family: \'Kaushan Script\', cursive;"');
            headerHtml = headerHtml.replace(/<div class="mobile-logo">\s*<a href="index">/g, '<div class="mobile-logo">\n                    <a href="index" style="font-family: \'Kaushan Script\', cursive;">');
        }

        const footerMatch = content.match(/<!-- Footer -->[\s\S]*?<\/footer>/);
        if (footerMatch) {
            footerHtml = footerMatch[0];
            footerHtml = footerHtml.replace(/<h2>MAC&Cino<\/h2>/g, '<h2 style="font-family: \'Kaushan Script\', cursive;">Macc & Cino</h2>');
        }
    }

    // Replace header and footer in all files
    content = content.replace(/(?:<!-- Sticky Navbar -->\s*)+<nav class="navbar" id="navbar">[\s\S]*?<\/nav>/, '<div id="app-header"></div>');
    content = content.replace(/<!-- Footer -->[\s\S]*?<\/footer>/, '<div id="app-footer"></div>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
});

fs.mkdirSync(path.join(publicDir, 'components'), { recursive: true });
fs.writeFileSync(path.join(publicDir, 'components', 'header.html'), headerHtml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'components', 'footer.html'), footerHtml, 'utf8');

console.log("Done refactoring HTML files.");
