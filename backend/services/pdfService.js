const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (order, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const invoicePath = path.join(__dirname, `../invoices/invoice_${order.id}.pdf`);

            // Ensure directory exists
            const dir = path.join(__dirname, '../invoices');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const writeStream = fs.createWriteStream(invoicePath);
            doc.pipe(writeStream);

            // Header
            doc.fontSize(20).text('Harshit Paints', { align: 'center' });
            doc.fontSize(10).text('123 Color Street, Paint City, PC 56789', { align: 'center' });
            doc.text('GSTIN: 22AAAAA0000A1Z5', { align: 'center' });
            doc.moveDown();

            // Invoice Info
            doc.fontSize(12).text(`Invoice Number: INV-${order.id.slice(0, 8).toUpperCase()}`);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
            doc.text(`Customer Name: ${user.name}`);
            doc.text(`Customer Email: ${user.email}`);
            doc.moveDown();

            // Table Header
            doc.fontSize(12).text('Item', 50, doc.y, { continued: true });
            doc.text('Qty', 250, doc.y, { continued: true });
            doc.text('Price/Unit', 350, doc.y, { continued: true });
            doc.text('Total', 450, doc.y);
            doc.moveDown(0.5);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);

            // Items
            order.orderItems.forEach(item => {
                doc.text(`${item.product.name} (${item.quantity_selected})`, 50, doc.y, { continued: true });
                doc.text(`${item.qty}`, 250, doc.y, { continued: true });
                doc.text(`Rs. ${item.price.toFixed(2)}`, 350, doc.y, { continued: true });
                doc.text(`Rs. ${(item.price * item.qty).toFixed(2)}`, 450, doc.y);
                doc.moveDown(0.5);
            });

            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // Summary
            doc.text(`Subtotal: Rs. ${(order.total_amount - order.discount_amount).toFixed(2)}`, { align: 'right' });
            doc.text(`GST (18%): Rs. ${order.gst_amount.toFixed(2)}`, { align: 'right' });
            doc.fontSize(14).text(`Final Amount: Rs. ${order.final_amount.toFixed(2)}`, { align: 'right' });

            doc.end();

            writeStream.on('finish', () => resolve(invoicePath));
            writeStream.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateInvoice };
