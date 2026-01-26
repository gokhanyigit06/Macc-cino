const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const [pageVisits, products, blogs] = await Promise.all([
        prisma.pageVisit.count(),
        prisma.product.count(),
        prisma.blogPost.count()
    ]);
    res.json({ pageVisits, products, blogs });
});

module.exports = router;
