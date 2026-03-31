import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Singleton service to handle external email dispatching via SMTP.
 * @namespace emailService
 */
export const emailService = {
    /**
     * Initializes the Nodemailer transport using environment variables.
     * @private
     * @returns {nodemailer.Transporter}
     */
    _createTransporter(): nodemailer.Transporter {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    },

    /**
     * Dispatches a password recovery email containing the secure reset URL.
     * @param {string} to - The recipient's email address.
     * @param {string} resetUrl - The secure frontend URL containing the unhashed token.
     * @returns {Promise<void>}
     */
    async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
        try {
            const transporter = this._createTransporter();

            const mailOptions = {
                from: '"TalentLens Support" <hello@demomailtrap.co>',
                to,
                subject: 'Password Reset Request',
                html: `
                    <h2>Password Reset</h2>
                    <p>You requested a password reset. Please click the link below to set a new password:</p>
                    <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to ${to}`);
        } catch (error) {
            console.error('SMTP Email Error:', error);
            throw new Error('Failed to send the reset email.');
        }
    }
};