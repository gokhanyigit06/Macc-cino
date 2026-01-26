const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('./middleware');

// Public: Submit a contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, sector, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'Lütfen zorunlu alanları doldurun.' });
        }

        const newMessage = await prisma.contactMessage.create({
            data: { name, email, phone, sector, message }
        });

        res.status(201).json(newMessage);
    } catch (err) {
        console.error('Contact submit error:', err);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// Admin: List all messages
router.get('/', authenticateToken, async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Mesajlar yüklenemedi.' });
    }
});

// Admin: Mark as read
router.put('/:id/read', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { isRead } = req.body;

        const updated = await prisma.contactMessage.update({
            where: { id: parseInt(id) },
            data: { isRead }
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Görüntüleme durumu güncellenemedi.' });
    }
});

// Admin: Delete message
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.contactMessage.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Mesaj silindi.' });
    } catch (err) {
        res.status(500).json({ error: 'Mesaj silinemedi.' });
    }
});

module.exports = router;
