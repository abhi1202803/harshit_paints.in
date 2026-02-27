const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Middleware to verify Admin token
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        if (payload.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.use(authenticateAdmin);

// Add a new brand
router.post('/brands', async (req, res) => {
    try {
        const { brand_name, discount_percentage } = req.body;
        const brand = await prisma.brand.create({
            data: { brand_name, discount_percentage }
        });
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create brand' });
    }
});

// Update brand discount
router.put('/brands/:id', async (req, res) => {
    try {
        const { discount_percentage } = req.body;
        const brand = await prisma.brand.update({
            where: { id: req.params.id },
            data: { discount_percentage }
        });
        res.json(brand);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update brand' });
    }
});

// Add a new product with quantities
router.post('/products', async (req, res) => {
    try {
        const { name, brand_id, description, gst_percentage, images, quantities } = req.body;

        // quantities = [{ quantity: "500ml", base_price: 500, stock: 100 }, ...]

        const product = await prisma.product.create({
            data: {
                name,
                brand_id,
                description,
                gst_percentage: gst_percentage || 18.0,
                images: images || [],
                quantities: {
                    create: quantities
                }
            },
            include: { quantities: true }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Get all orders (Admin view)
router.get('/orders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                orderItems: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
