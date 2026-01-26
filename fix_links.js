
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let result = data.replace(/href="#hakkimizda"/g, 'href="about"');
    result = result.replace(/href="#iletisim"/g, 'href="contact"');

    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) return console.log(err);
        console.log('Successfully updated links in index.html');
    });
});
