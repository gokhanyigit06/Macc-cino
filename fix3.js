const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'fitness.html');
let content = fs.readFileSync(file, 'utf8');

// Replace everything between VE ENERJİ KAYNA and </span>
content = content.replace(/VE ENERJİ KAYNA.*<\/span>/g, 'VE ENERJİ KAYNAĞI</span>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed fitness.html again');
