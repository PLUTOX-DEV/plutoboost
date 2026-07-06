import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates a transporter object using the default SMTP transport for Gmail.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address from .env file
    pass: process.env.SMTP_PASS, // Your Gmail App Password from .env file
  },
});

export const sendEmail = async (to, subject, html) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('[Mailer] SMTP user or password is not configured in .env file. Skipping email.');
    return;
  }

  const mailOptions = {
    to: to,
    from: `"PlutoBoost Notifier" <${process.env.SMTP_USER}>`,
    subject: subject,
    html: html,
    text: html.replace(/<[^>]*>?/gm, ''),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Email sent successfully to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`[Mailer] Failed to send email to ${to}:`, error);
    // Throw a more specific error to be caught by the calling function
    if (error.responseCode === 535) {
      throw new Error('Authentication error with email provider. Check SMTP_USER and SMTP_PASS.');
    }
    throw new Error('Failed to send email.');
  }
};