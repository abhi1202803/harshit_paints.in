const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all brands
router.get('/brands', async (req, res) => {
    try {
        const brands = await prisma.brand.findMany();
        res.json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
});

// Get all products (with optional brand filter)
router.get('/', async (req, res) => {
    try {
        const { brand_id } = req.query;

        const filter = {};
        if (brand_id) filter.brand_id = brand_id;

        const products = await prisma.product.findMany({
            where: filter,
            include: {
                brand: true,
                quantities: true,
            },
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                brand: true,
                quantities: true,
            },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

module.exports = router;
