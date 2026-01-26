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

// Add product
router.post('/', authenticateToken, async (req, res) => {
    const { name, description, category, imageUrl, features } = req.body;
    try {
        const product = await prisma.product.create({
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
