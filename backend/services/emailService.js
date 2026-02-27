const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass'
    }
});

const sendOrderConfirmation = async (user, order, invoicePath) => {
    try {
        const mailOptions = {
            from: '"Harshit Paints" <orders@harshitpaints.com>',
            to: user.email,
            subject: `Order Confirmed - Harshit Paints (${order.id})`,
            html: `
        <h2>Thank you for your order, ${user.name}!</h2>
        <p>Your order has been confirmed successfully. You can find the details below:</p>
        <ul>
          <li><strong>Order ID:</strong> ${order.id}</li>
          <li><strong>Amount Paid:</strong> Rs. ${order.final_amount.toFixed(2)}</li>
          <li><strong>Status:</strong> ${order.status}</li>
        </ul>
        <p>We have attached the GST invoice for your reference.</p>
        <p>Thanks for choosing Harshit Paints!</p>
      `,
            attachments: [
                {
                    filename: `Invoice_${order.id}.pdf`,
                    path: invoicePath,
                    contentType: 'application/pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendOrderConfirmation };
