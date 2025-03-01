import nodemailer from 'nodemailer';
import { emailTemplates } from './Email-template.js';
import { accountEmail } from '../../Config/Nodemailer.js';
import { EMAIL_PASSWORD } from '../../Config/Env.js';

const sendreminderEmail = async ({ to, type, subscription }) => {
    if (!to || typeof to !== 'string') {
        throw new Error('Invalid email type');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: accountEmail,
            pass: EMAIL_PASSWORD,
        },
    });

    const template = emailTemplates.find(t => t.label === type);
    if (!template) {
        throw new Error('Invalid email type');
    }

    const data = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: subscription.renewalDate,
        planName: subscription.name,
        price: `${subscription.price} ${subscription.currency}`,
        paymentMethod: subscription.paymentMethod,
        accountSettingsLink: 'https://example.com/account-settings', // Replace with actual link
        supportLink: 'https://example.com/support', // Replace with actual link
    };

    const htmlContent = template.generateBody(data);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: template.generateSubject(data),
        html: htmlContent, // Use the generated HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
};

export { sendreminderEmail };