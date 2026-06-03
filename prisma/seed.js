require('dotenv').config();
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

    // NOTE: Demo product/blog seeding was intentionally removed. Re-seeding on
    // every deploy kept resurrecting demo content that the admin had deleted or
    // hidden. Real content is managed entirely from the admin panel, and the DB
    // is now persisted via a volume (see Dockerfile DATABASE_URL).
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
