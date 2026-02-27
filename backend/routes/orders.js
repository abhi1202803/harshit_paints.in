const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { generateInvoice } = require('../services/pdfService');
const { sendOrderConfirmation } = require('../services/emailService');

const prisma = new PrismaClient();

// Middleware to verify user token
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Create an order
router.post('/', authenticate, async (req, res) => {
    try {
        const { items, coupon_code } = req.body; // Array of { product_qty_id, qty }
        const userId = req.user.userId;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }

        let total_amount = 0;
        let discount_amount = 0;
        const orderItemsData = [];

        // Calculate totals and verify items
        for (const item of items) {
            const productQty = await prisma.productQuantity.findUnique({
                where: { id: item.product_qty_id },
                include: { product: { include: { brand: true } } },
            });

            if (!productQty) {
                return res.status(400).json({ error: `Invalid product quantity ID: ${item.product_qty_id}` });
            }

            if (productQty.stock < item.qty) {
                return res.status(400).json({ error: `Insufficient stock for ${productQty.product.name} - ${productQty.quantity}` });
            }

            const basePrice = productQty.base_price;
            const brandDiscount = productQty.product.brand.discount_percentage;

            const itemTotal = basePrice * item.qty;
            const itemBrandDiscount = itemTotal * (brandDiscount / 100);
            const afterBrandDiscount = itemTotal - itemBrandDiscount;

            total_amount += itemTotal;
            discount_amount += itemBrandDiscount;

            orderItemsData.push({
                product_id: productQty.product_id,
                quantity_selected: productQty.quantity,
                price: afterBrandDiscount / item.qty, // Price per item after brand discount (before coupon & GST)
                qty: item.qty
            });
        }

        // Harshit Paints Global GST logic - Example 18% on discounted base total
        // (In reality, GST might be per product, but we'll use a global 18% or average from products)
        const gstRate = 0.18;

        let final_subtotal = total_amount - discount_amount; // Subtotal after brand discounts

        // Apply global coupon discount (15% for 'bgmi')
        if (coupon_code && coupon_code.toLowerCase() === 'bgmi') {
            const couponDiscount = final_subtotal * 0.15;
            discount_amount += couponDiscount; // Add to total recorded discount
            final_subtotal -= couponDiscount;
        }

        const gst_amount = final_subtotal * gstRate;
        const final_amount = final_subtotal + gst_amount;

        // Create order transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create order
            const newOrder = await tx.order.create({
                data: {
                    user_id: userId,
                    total_amount,
                    gst_amount,
                    discount_amount,
                    final_amount,
                    status: 'PENDING',
                    orderItems: {
                        create: orderItemsData,
                    },
                },
                include: {
                    orderItems: true
                }
            });

            // 2. Decrement stock
            for (const item of items) {
                await tx.productQuantity.update({
                    where: { id: item.product_qty_id },
                    data: { stock: { decrement: item.qty } }
                });
            }

            return newOrder;
        });

        // 3. Generate Invoice and Send Email
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            // Generate the PDF invoice
            const invoicePath = await generateInvoice(order, user);

            // Send the email with the invoice attached
            await sendOrderConfirmation(user, order, invoicePath);
        } catch (emailError) {
            console.error('Failed to generate invoice or send email:', emailError);
            // We don't fail the order creation if the email fails, but we log the error
        }

        res.status(201).json({ message: 'Order created successfully. Confirmation email sent.', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Order creation failed' });
    }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { user_id: req.user.userId },
            include: { orderItems: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
