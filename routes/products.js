const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');
const authenticateToken = require('./middleware');
const upload = require('./upload_middleware');
const { normLang, localizeMany, translationData } = require('./localize');

const parseBool = (v) => v === true || v === 'true' || v === '1' || v === 1;
const TRANSLATABLE = ['name', 'description', 'features'];

// Get all products. Authenticated admin requests may include hidden products
// via ?includeHidden=1 — anonymous callers always get visible-only.
router.get('/', async (req, res) => {
    let includeHidden = false;
    if (req.query.includeHidden === '1') {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            try {
                jwt.verify(token, JWT_SECRET);
                includeHidden = true;
            } catch (_) { /* ignore */ }
        }
    }
    const where = includeHidden ? {} : { isVisible: true };
    let products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });

    // Filter by sector if requested (CSV match in stored `sectors` field)
    if (req.query.sector) {
        const wanted = String(req.query.sector).toLowerCase().trim();
        products = products.filter(p => {
            if (!p.sectors) return false;
            return p.sectors.split(',').map(s => s.trim().toLowerCase()).includes(wanted);
        });
    }

    // Localize for public requests; admin (includeHidden) keeps raw fields.
    const lang = normLang(req.query.lang);
    res.json(includeHidden ? products : localizeMany(products, lang, TRANSLATABLE));
});

// Add product (with image upload)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    let { name, description, category, features, imageUrl, isVisible, sectors } = req.body;

    if (req.file) {
        imageUrl = 'uploads/' + req.file.filename;
    }

    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                category,
                imageUrl,
                features,
                sectors: sectors || null,
                isVisible: isVisible === undefined ? true : parseBool(isVisible),
                ...translationData(req.body, TRANSLATABLE)
            }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    let { name, description, category, features, imageUrl, isVisible, sectors } = req.body;

    if (req.file) {
        imageUrl = 'uploads/' + req.file.filename;
    }

    const data = { name, description, category, imageUrl, features, ...translationData(req.body, TRANSLATABLE) };
    if (isVisible !== undefined) data.isVisible = parseBool(isVisible);
    if (sectors !== undefined) data.sectors = sectors || null;

    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle visibility
router.patch('/:id/visibility', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const current = await prisma.product.findUnique({ where: { id } });
        if (!current) return res.status(404).json({ error: 'Not found' });
        const product = await prisma.product.update({
            where: { id },
            data: { isVisible: !current.isVisible }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

module.exports = router;
