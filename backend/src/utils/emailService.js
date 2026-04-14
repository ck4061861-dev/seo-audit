import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ─────────────────────────────────────────
// Email Transporter Configuration
// ─────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// ─────────────────────────────────────────
// Send OTP Email
// ─────────────────────────────────────────
export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - SEO Auditor',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #2f7a78; text-align: center;">Password Reset Request</h2>
            <p style="color: #333; text-align: center; margin: 20px 0;">
              You requested a password reset. Use this OTP to proceed:
            </p>
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2f7a78; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">
              This OTP will expire in 5 minutes.
            </p>
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send OTP email');
  }
};
