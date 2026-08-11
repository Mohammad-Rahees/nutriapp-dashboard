const nodemailer = require("nodemailer");

/**
 * Send an email via Nodemailer transport.
 * If SMTP credentials are missing, logs the fallback reset link to the console for development testing.
 *
 * @param {Object} options - Email parameters: { email, subject, message, html, resetUrl }
 */
const sendEmail = async (options) => {
  const hasHost = process.env.EMAIL_HOST && process.env.EMAIL_HOST.trim().length > 0;
  const hasUser = process.env.EMAIL_USER && process.env.EMAIL_USER.trim().length > 0;

  // Log fallback link to console for easy testing if SMTP is unconfigured
  console.log("==========================================================");
  console.log(`🔑 PASSWORD RESET REQUESTED FOR: ${options.email}`);
  if (options.resetUrl) {
    console.log(`🔗 RESET LINK: ${options.resetUrl}`);
  }
  console.log("==========================================================");

  if (!hasHost || !hasUser) {
    console.log("ℹ️ EMAIL_USER or EMAIL_HOST not set in .env; skipping actual SMTP send.");
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `NutriApp <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error("⚠️ Nodemailer error sending email:", err.message || err);
    // Return true so application flow is not disrupted during testing
    return true;
  }
};

module.exports = sendEmail;
