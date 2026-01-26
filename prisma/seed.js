const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin', 10);
    const user = await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: {}, // Don't update if exists
        create: {
            username: 'admin',
            password: password,
        },
    });
    console.log('Default admin user seeded:', user.username);

    // Seed Products
    const products = [
        {
            name: "Barista Pro XT",
            category: "espresso cafe", // Matches filter data-category
            description: "Yoğun işletmeler için tasarlanmış, çift gruplu ve yüksek buhar kapasiteli profesyonel espresso makinesi.",
            imageUrl: "assets/products/product1.png",
            features: "Çift Grup, Yüksek Kapasite, PID Kontrol"
        },
        {
            name: "Office Master 3000",
            category: "otomatik ofis",
            description: "Tek dokunuşla latte, cappuccino ve espresso. Şık dokunmatik ekranı ve tam otomatik temizleme sistemi ile ofislerin vazgeçilmezi.",
            imageUrl: "assets/products/product2.png",
            features: "Dokunmatik Ekran, Tek Tuşla Sütlü İçecek, Otomatik Temizleme"
        },
        {
            name: "VendMax 500",
            category: "vending otel",
            description: "Geniş dokunmatik ekranlı, ödeme sistemi entegre edilebilir, yüksek kapasiteli otomat çözümü.",
            imageUrl: "assets/products/product3.png",
            features: "7/24 Hizmet, Ödeme Sistemi, Geniş Kapasite"
        },
        {
            name: "Bianco Elegance",
            category: "espresso cafe",
            description: "Ahşap detaylı, beyaz gövdeli, tasarım ödüllü espresso makinesi. Butik kafeler için ideal.",
            imageUrl: "assets/products/product4.png",
            features: "Ödüllü Tasarım, Ahşap Detaylar, Stabil Isı"
        },
        {
            name: "Barista Compact",
            category: "espresso cafe",
            description: "Küçük mekanlar için büyük lezzet.",
            imageUrl: "assets/products/product1.png",
            features: "Kompakt Tasarım, Güçlü Performans"
        }
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { id: 0 }, // Fake condition to force create only if empty logic could be better, but simple createMany or check count is better.
            // Upsert requires unique field. Product name isn't unique in schema but practical here.
            // Changing strategy: delete all and re-seed or check existence by name.
            update: {},
            create: product,
        }).catch(async () => {
            // Fallback if upsert fails on ID or similar, let's just create if not exists by name
            const exists = await prisma.product.findFirst({ where: { name: product.name } });
            if (!exists) await prisma.product.create({ data: product });
        });
    }
    console.log('Products seeded.');

    // Seed Blog Posts (Trends)
    const blogs = [
        {
            title: "Salty Caramel Kiss",
            content: "Tuzlu karamelin tatlı sert uyumu... Heyecan verici yeni özel içeceklerimizi keşfedin.",
            imageUrl: "assets/products/product3.png"
        },
        {
            title: "Chai Latte",
            content: "Baharatlı ve aromatik Chai çayı, kremamsı süt köpüğüyle buluşur - gerçek bir lezzet deneyimi.",
            imageUrl: "assets/products/product1.png"
        },
        {
            title: "Matcha",
            content: "Matcha'nın canlandırıcı dünyasını keşfedin – sıcak, soğuk ve Vegan olmak üzere üç karşı konulmaz seçenekle.",
            imageUrl: "assets/misc/blog1.png"
        }
    ];

    for (const blog of blogs) {
        // Check if exists
        const exists = await prisma.blogPost.findFirst({ where: { title: blog.title } });
        if (!exists) {
            await prisma.blogPost.create({ data: blog });
        }
    }
    console.log('Blog posts seeded.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
