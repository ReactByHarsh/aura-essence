import nodemailer from 'nodemailer';

export async function sendOrderNotification(orderId: string, orderDetails: any) {
    console.log(`[Notification] Sending order confirmation for Order #${orderId}`);

    const { items, shipping, amount, paymentMethod } = orderDetails;

    // Configure transporter (using Gmail as an example)
    // User needs to set EMAIL_USER and EMAIL_PASS (App Password) in .env
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: ['yash.v.shinde@gmail.com', shipping.email], // Send to admin AND customer
        subject: `Order Confirmation #${orderId} - Aura Essence`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d97706;">Order Confirmed!</h1>
        <p>Thank you for your order. Here are the details:</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total Amount:</strong> ₹${amount}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        </div>

        <h3>Items:</h3>
        <ul style="list-style: none; padding: 0;">
          ${items.map((item: any) => `
            <li style="border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
              <strong>${item.name}</strong><br/>
              Qty: ${item.units} | Price: ₹${item.selling_price}
            </li>
          `).join('')}
        </ul>

        <h3>Shipping Address:</h3>
        <p style="color: #475569;">
          ${shipping.name}<br/>
          ${shipping.address}<br/>
          ${shipping.city}, ${shipping.state} - ${shipping.pincode}<br/>
          Phone: ${shipping.phone}
        </p>
      </div>
    `,
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('[Notification] Email credentials missing. Skipping email send.');
            return;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('[Notification] Email sent:', info.messageId);
    } catch (error) {
        console.error('[Notification] Failed to send email:', error);
    }
}
