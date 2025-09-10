import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
});

// Beautiful HTML email template
const createEmailTemplate = (email: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Rovify</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          color: #374151;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .email-header {
          background: linear-gradient(135deg, #FF5722 0%, #FF9800 100%);
          padding: 30px;
          color: white;
          text-align: center;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 12px;
          padding: 10px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo img {
          width: 40px;
          height: 40px;
        }
        
        .email-body {
          padding: 30px;
        }
        
        .email-footer {
          background-color: #f9fafb;
          padding: 20px 30px;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        h1 {
          color: #1f2937;
          font-size: 24px;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 16px;
        }
        
        p {
          margin: 16px 0;
        }
        
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #FF5722 0%, #FF9800 100%);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          margin: 24px 0;
          text-align: center;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin: 30px 0;
        }
        
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        
        .feature-icon {
          width: 36px;
          height: 36px;
          background-color: rgba(255, 87, 34, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF5722;
          flex-shrink: 0;
        }
        
        .feature-text {
          flex: 1;
        }
        
        .feature-title {
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 5px 0;
        }
        
        .feature-desc {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 20px;
        }
        
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: #f3f4f6;
          border-radius: 8px;
          color: #6b7280;
        }
        
        @media (max-width: 600px) {
          .email-container {
            border-radius: 0;
          }
          
          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="logo">
            <img src="https://rovify.io/logo.png" alt="Rovify Logo">
          </div>
          <h2 style="margin: 0; font-size: 28px; font-weight: 700;">Welcome to Rovify!</h2>
          <p style="margin: 10px 0 0; opacity: 0.9;">Your gateway to premium NFT events</p>
        </div>
        
        <div class="email-body">
          <h1>Thanks for subscribing, ${email.split('@')[0]}!</h1>
          <p>You're now part of the Rovify community — where traditional events meet blockchain innovation. Get ready for exclusive updates on new features, upcoming events, and special NFT drops.</p>
          
          <div class="feature-grid">
            <div class="feature-item">
              <div class="feature-icon">🎟️</div>
              <div class="feature-text">
                <p class="feature-title">NFT Ticketing</p>
                <p class="feature-desc">Secure, collectible tickets for unique experiences</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🔍</div>
              <div class="feature-text">
                <p class="feature-title">Event Discovery</p>
                <p class="feature-desc">Find trending events tailored to your interests</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🌟</div>
              <div class="feature-text">
                <p class="feature-title">Exclusive Benefits</p>
                <p class="feature-desc">Special perks and VIP access for attendees</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🚀</div>
              <div class="feature-text">
                <p class="feature-title">Creator Tools</p>
                <p class="feature-desc">Powerful platform for event organisers</p>
              </div>
            </div>
          </div>
          
          <p style="text-align: center;">Ready to explore? Check out upcoming events on Rovify!</p>
          <div style="text-align: center;">
            <a href="https://rovify.io/events" class="button">Browse Events</a>
          </div>
        </div>
        
        <div class="email-footer">
          <p style="margin-bottom: 16px;">© 2025 Rovify. All rights reserved.</p>
          <p style="margin-bottom: 16px;">Kigali, Rwanda</p>
          <div class="social-links">
            <a href="https://twitter.com/rovify" class="social-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com/rovify" class="social-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://linkedin.com/company/rovify" class="social-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
          <p style="margin-top: 16px; font-size: 11px;">
            You're receiving this email because you subscribed to Rovify updates.<br>
            If you'd prefer not to receive these emails, you can <a href="https://rovify.io/unsubscribe?email=${email}" style="color: #6b7280;">unsubscribe</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Simple validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address'
      }, { status: 400 });
    }

    // Store in database (mock)
    console.log(`Email subscribed: ${email}`);

    // Send welcome email
    const mailOptions = {
      from: {
        name: 'Rovify',
        address: process.env.EMAIL_USER as string
      },
      to: email,
      subject: 'Welcome to Rovify! 🎟️ Your NFT Event Journey Begins',
      html: createEmailTemplate(email),
    };

    await transporter.sendMail(mailOptions);

    // Add the email to your newsletter service (mock)
    // In production, you'd use your email marketing provider's API
    // e.g., Mailchimp, ConvertKit, etc.

    return NextResponse.json({
      success: true,
      message: 'Subscription successful'
    });
  } catch (error) {
    console.error('Subscription error:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to process subscription'
    }, { status: 500 });
  }
}