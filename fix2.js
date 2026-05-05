const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'fitness.html');
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/KAYNAÄžI/g, 'KAYNAĞI');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed fitness.html');
