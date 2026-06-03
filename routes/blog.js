const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('./middleware');
const { normLang, localizeMany, translationData } = require('./localize');
const TRANSLATABLE = ['title', 'content'];

// Get all blogs (localized for public ?lang=de|en; raw otherwise)
router.get('/', async (req, res) => {
    const blogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(localizeMany(blogs, normLang(req.query.lang), TRANSLATABLE));
});

const upload = require('./upload_middleware');

// Add blog
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    let { title, content, imageUrl } = req.body;
    if (req.file) {
        imageUrl = 'uploads/' + req.file.filename;
    }

    try {
        const blog = await prisma.blogPost.create({
            data: { title, content, imageUrl, ...translationData(req.body, TRANSLATABLE) }
        });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update blog
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    let { title, content, imageUrl } = req.body;
    if (req.file) {
        imageUrl = 'uploads/' + req.file.filename;
    }

    try {
        const blog = await prisma.blogPost.update({
            where: { id: parseInt(id) },
            data: { title, content, imageUrl, ...translationData(req.body, TRANSLATABLE) }
        });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete blog
router.delete('/:id', authenticateToken, async (req, res) => {
    await prisma.blogPost.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

module.exports = router;
