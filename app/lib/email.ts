import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your LearnQuest password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #7c3aed;">Reset your password</h2>
        <p>You requested a password reset for your LearnQuest account. Click the button below to set a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="display:inline-block; padding:14px 28px; background:#7c3aed; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.2);">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          LearnQuest - Gamified Learning Platform
        </p>
      </div>
    `,
  });
}
