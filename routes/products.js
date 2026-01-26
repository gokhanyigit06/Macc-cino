const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('./middleware');

// Get all products
router.get('/', async (req, res) => {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
});

const upload = require('./upload_middleware');

// Add product (with image upload)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    // If file uploaded, use its path. If not, check body for manual URL (optional fallback)
    let { name, description, category, features, imageUrl } = req.body;

    if (req.file) {
        imageUrl = 'uploads/' + req.file.filename;
    }

    try {
        const product = await prisma.product.create({
            data: { name, description, category, imageUrl, features }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    let { name, description, category, features, imageUrl } = req.body;

    if (req.file) {
        imageUrl = 'uploads/' + req.file.filename;
    }

    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { name, description, category, imageUrl, features }
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
