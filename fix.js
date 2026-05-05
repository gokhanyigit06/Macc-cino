const fs = require('fs');
const path = require('path');

const fixFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const replacements = {
        'KÃ‚RLILIÄžINIZI': 'KÂRLILIĞINIZI',
        'KÃ¢rlı': 'Kârlı',
        'kÃ¢rlılığını': 'kârlılığını',
        'KAYNAÄžI': 'KAYNAĞI'
    };

    let modified = false;
    for (const [bad, good] of Object.entries(replacements)) {
        if (content.includes(bad)) {
            content = content.split(bad).join(good);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${path.basename(filePath)}`);
    }
};

const publicDir = path.join(__dirname, 'public');
fs.readdirSync(publicDir).forEach(file => {
    if (file.endsWith('.html')) {
        fixFile(path.join(publicDir, file));
    }
});

console.log("Done");
