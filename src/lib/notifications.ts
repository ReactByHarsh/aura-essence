import nodemailer from 'nodemailer';

export async function sendOrderNotification(
  orderId: string,
  orderDetails: any,
  status: 'confirmed' | 'cancelled' | 'failed' = 'confirmed'
) {
  console.log(`[Notification] Sending ${status} notification for Order #${orderId}`);

  const { items, shipping, amount, paymentMethod } = orderDetails;

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const config = {
    confirmed: {
      subject: `Order Confirmation #${orderId} - Aura Essence`,
      title: 'Order Confirmed!',
      color: '#d97706', // Amber/Orange
      message: 'Thank you for your order. Here are the details:',
    },
    cancelled: {
      subject: `Order Cancelled #${orderId} - Aura Essence`,
      title: 'Order Cancelled',
      color: '#dc2626', // Red
      message: 'This order transaction was cancelled or failed. Details below:',
    },
    failed: {
      subject: `Payment Failed #${orderId} - Aura Essence`,
      title: 'Payment Failed',
      color: '#dc2626', // Red
      message: 'The payment for this order could not be completed. Details below:',
    }
  };

  const currentConfig = config[status];

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: ['yash.v.shinde@gmail.com', shipping.email],
    subject: currentConfig.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${currentConfig.color};">${currentConfig.title}</h1>
        <p>${currentConfig.message}</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order/Transaction ID:</strong> ${orderId}</p>
          <p><strong>Total Amount:</strong> ₹${amount}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} (${status})</p>
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
