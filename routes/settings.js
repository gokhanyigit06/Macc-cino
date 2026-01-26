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

const upload = require('./upload_middleware');

// Update settings
router.post('/', authenticateToken, upload.single('logo_file'), async (req, res) => {
    // If file uploaded, update site_logo specifically
    const updates = [];

    // Helper to add update promise
    const addUpdate = (key, value) => {
        updates.push(prisma.settings.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        }));
    };

    if (req.file) {
        addUpdate('site_logo', 'uploads/' + req.file.filename);
    } else if (req.body.site_logo) {
        addUpdate('site_logo', req.body.site_logo);
    }

    // Handle other colors
    if (req.body.primary_color) addUpdate('primary_color', req.body.primary_color);
    if (req.body.accent_color) addUpdate('accent_color', req.body.accent_color);

    try {
        await Promise.all(updates);
        res.json({ message: 'Settings updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
