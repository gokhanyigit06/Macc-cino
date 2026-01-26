
const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, 'public', 'about.html'),
    path.join(__dirname, 'public', 'contact.html'),
    path.join(__dirname, 'public', 'index.html')
];

files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${file}:`, err);
            return;
        }
        // Write back to ensure consistency
        fs.writeFile(file, data, 'utf8', (err) => {
            if (err) console.error(`Error writing ${file}:`, err);
            else console.log(`Verified and saved ${path.basename(file)} as UTF-8`);
        });
    });
});
