const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const fixEmails = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixEmails(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            const emailsToReplace = [
                'kurumsal@baristacompany.com',
                'bilgi@baristacompany.com',
                'servis@mac-cino.com',
                'bilgi@mac-cino.com'
            ];

            emailsToReplace.forEach(email => {
                if (content.includes(email)) {
                    content = content.split(email).join('info@macc-cino.com');
                    modified = true;
                }
            });

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated emails in ${file}`);
            }
        }
    });
};

fixEmails(publicDir);
console.log('Email update complete.');
