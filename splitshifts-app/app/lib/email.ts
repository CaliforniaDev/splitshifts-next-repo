import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { logError } from './utils';

let mailerInstance: Transporter | null = null;

/**
 * Lazily initializes and returns the email transporter
 * Throws at call-time if RESEND_API_KEY is missing, not at import-time
 * 
 * @returns Nodemailer transporter configured with Resend SMTP
 * @throws Error if RESEND_API_KEY environment variable is not set
 */
export function getMailer(): Transporter {
  if (mailerInstance) {
    return mailerInstance;
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    // For local development without email, consider returning a no-op transport
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'RESEND_API_KEY is missing. Email sending will fail in development.'
      );
    }
    throw new Error(
      'RESEND_API_KEY environment variable is required for email functionality.'
    );
  }

  mailerInstance = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    auth: {
      user: 'resend',
      pass: resendKey,
    },
    // Connection timeouts to prevent hanging
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 15000, // 15 seconds
  });

  return mailerInstance;
}

/**
 * Sends an email with retry logic and exponential backoff
 * 
 * @param mailOptions - Nodemailer mail options
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Promise resolving to send result
 */
export async function sendEmailWithRetry(
  mailOptions: nodemailer.SendMailOptions,
  maxRetries = 2
): Promise<nodemailer.SentMessageInfo> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const mailer = getMailer();
      const result = await mailer.sendMail(mailOptions);
      
      // Log success
      if (attempt > 0) {
        console.log(`Email sent successfully after ${attempt} retries`, {
          to: mailOptions.to,
          subject: mailOptions.subject,
        });
      }
      
      return result;
    } catch (error) {
      lastError = error as Error;
      
      logError(`Email send attempt ${attempt + 1} failed`, error);
      
      // Don't retry on last attempt
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  // All retries failed
  logError('All email send attempts failed', lastError);
  throw lastError || new Error('Failed to send email after retries');
}

// Maintain backwards compatibility with direct mailer export
// This will now throw if called before RESEND_API_KEY is set
export const mailer = new Proxy({} as Transporter, {
  get(_target, prop) {
    const instance = getMailer();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

