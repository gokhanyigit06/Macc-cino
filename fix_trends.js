const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'trends.html');
let content = fs.readFileSync(file, 'utf8');

// The text is roughly "Sıcak [corrupted char] Soğuk"
content = content.replace(/Sıcak.*Soğuk/g, 'Sıcak &amp; Soğuk');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed trends.html');
