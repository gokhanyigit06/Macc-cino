const fs = require('fs');
const path = require('path');

const directory = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';

const replacements = [
    { from: /â€“/g, to: '–' },
    { from: /â€"/g, to: '–' },
    { from: /â€”/g, to: '—' },
    { from: /â€™/g, to: "'" },
    { from: /â­ /g, to: '⭐' },
    { from: /iÅİşletmeniz/g, to: 'işletmeniz' },
    { from: /iÅŸ/g, to: 'iş' },
    { from: /ÅŸ/g, to: 'ş' },
    { from: /Ä±/g, to: 'ı' },
    { from: /ÄŸ/g, to: 'ğ' },
    { from: /Ã§/g, to: 'ç' },
    { from: /Ã¼/g, to: 'ü' },
    { from: /Ã¶/g, to: 'ö' },
    { from: /Ä°/g, to: 'İ' },
    { from: /Åž/g, to: 'Ş' },
    { from: /Äž/g, to: 'Ğ' },
    { from: /Ã‡/g, to: 'Ç' },
    { from: /Ãœ/g, to: 'Ü' },
    { from: /Ã–/g, to: 'Ö' },
    { from: /â€œ/g, to: '“' },
    { from: /â€/g, to: '”' },
    { from: /â€¦/g, to: '...' },
    { from: /Â /g, to: ' ' } // Non-breaking space
];

const htmlFiles = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(directory, file);
    let originalContent = fs.readFileSync(filePath, 'utf8');
    let content = originalContent;

    // 1. Fix encoding/corrupted chars
    replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
    });

    // 2. Add WhatsApp Button if missing
    if (!content.includes('whatsapp-btn')) {
        const whatsappHtml = `\n    <!-- WhatsApp Button -->\n    <a href="https://wa.me/905555555555" target="_blank" class="whatsapp-btn" title="WhatsApp Hattı">\n        <i class="fab fa-whatsapp"></i>\n    </a>\n`;
        if (content.includes('</nav>')) {
            content = content.replace('</nav>', '</nav>' + whatsappHtml);
        }
    }

    // 3. Remove broken img tags referencing .html files
    content = content.replace(/<img[^>]*src=["'][^"']*\.html["'][^>]*>/gi, '');

    // 4. Ensure UTF-8 meta is present
    if (!content.includes('<meta charset="UTF-8">')) {
        content = content.replace(/<head>/i, '<head>\n    <meta charset="UTF-8">');
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${file}`);
    } else {
        console.log(`➖ No changes needed: ${file}`);
    }
});

console.log('--- FINAL SWEEP COMPLETE ---');
