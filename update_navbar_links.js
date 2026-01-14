const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\PC\\.gemini\\antigravity\\scratch\\cupcino_rebuild';

// Tüm HTML dosyalarını bul
const htmlFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. İletişim linkini güncelle
    content = content.replace(
        /<a href="index\.html#iletisim" class="nav-link">İletişim<\/a>/g,
        '<a href="contact.html" class="nav-link">İletişim</a>'
    );

    // 2. Hakkımızda linkini güncelle
    content = content.replace(
        /<a href="index\.html#hakkimizda" class="nav-link">Hakkımızda<\/a>/g,
        '<a href="about.html" class="nav-link">Hakkımızda</a>'
    );

    // Eğer değişiklik olduysa kaydet
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated navbar links in ${file}`);
    }
});

console.log('\n✅ All navbar links updated successfully!');
