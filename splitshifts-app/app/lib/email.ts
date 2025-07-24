import nodemailer from 'nodemailer';

const resendKey = process.env.RESEND_API_KEY;

if (!resendKey) {
  throw new Error('RESEND_API_KEY is missing. Cannot initialize mailer.');
}

export const mailer = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  auth: {
    user: 'resend', 
    pass: resendKey,
  },
});
