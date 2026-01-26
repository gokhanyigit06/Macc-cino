const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('./middleware');

// Get settings
router.get('/', async (req, res) => {
    const settings = await prisma.settings.findMany();
    // Convert array to object { key: value }
    const settingsObj = {};
    settings.forEach(s => settingsObj[s.key] = s.value);
    res.json(settingsObj);
});

// Update settings
router.post('/', authenticateToken, async (req, res) => {
    // Expect body: { "site_logo": "url", "primary_color": "#hex", ... }
    const updates = Object.entries(req.body);
    try {
        const promises = updates.map(([key, value]) => {
            return prisma.settings.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        });
        await Promise.all(promises);
        res.json({ message: 'Settings updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
