const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('./middleware');
const upload = require('./upload_middleware');
const { normLang, localizeMany, translationData } = require('./localize');

const parseBool = (v) => v === true || v === 'true' || v === '1' || v === 1;
const TRANSLATABLE = ['title', 'subtitle'];

// Public: list active slides ordered by `order` then createdAt (localized)
router.get('/slides', async (req, res) => {
    const slides = await prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
    });
    res.json(localizeMany(slides, normLang(req.query.lang), TRANSLATABLE));
});

// Admin: list all slides (active + inactive)
router.get('/slides/all', authenticateToken, async (req, res) => {
    const slides = await prisma.heroSlide.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
    });
    res.json(slides);
});

router.post('/slides', authenticateToken, upload.single('media'), async (req, res) => {
    let { type, title, subtitle, order, isActive, mediaUrl } = req.body;
    if (req.file) {
        mediaUrl = 'uploads/' + req.file.filename;
    }
    if (!type || !mediaUrl) {
        return res.status(400).json({ error: 'type and media are required' });
    }
    try {
        const slide = await prisma.heroSlide.create({
            data: {
                type,
                mediaUrl,
                title: title || null,
                subtitle: subtitle || null,
                order: order ? parseInt(order) : 0,
                isActive: isActive === undefined ? true : parseBool(isActive),
                ...translationData(req.body, TRANSLATABLE)
            }
        });
        res.json(slide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/slides/:id', authenticateToken, upload.single('media'), async (req, res) => {
    const id = parseInt(req.params.id);
    let { type, title, subtitle, order, isActive, mediaUrl } = req.body;
    if (req.file) {
        mediaUrl = 'uploads/' + req.file.filename;
    }
    const data = {};
    if (type !== undefined) data.type = type;
    if (mediaUrl !== undefined) data.mediaUrl = mediaUrl;
    if (title !== undefined) data.title = title || null;
    if (subtitle !== undefined) data.subtitle = subtitle || null;
    if (order !== undefined) data.order = parseInt(order);
    if (isActive !== undefined) data.isActive = parseBool(isActive);
    Object.assign(data, translationData(req.body, TRANSLATABLE));
    try {
        const slide = await prisma.heroSlide.update({ where: { id }, data });
        res.json(slide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/slides/:id/toggle', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const current = await prisma.heroSlide.findUnique({ where: { id } });
        if (!current) return res.status(404).json({ error: 'Not found' });
        const slide = await prisma.heroSlide.update({
            where: { id },
            data: { isActive: !current.isActive }
        });
        res.json(slide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/slides/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.heroSlide.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
