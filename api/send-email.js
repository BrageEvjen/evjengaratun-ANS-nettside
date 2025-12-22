import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { name, email, message, language } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Language-specific subject lines
    const subjects = {
      nb: 'Ny henvendelse fra kontaktskjema',
      nn: 'Ny henvendelse frå kontaktskjema',
      en: 'New contact form submission'
    };

    const subject = subjects[language] || subjects.nb;

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Evjen & Garatun <onboarding@resend.dev>', // You'll update this after verifying your domain
      to: 'brage@zak.no', // Your business email
      replyTo: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #18181b; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #18181b; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #e4e4e7; border-top: none; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: 600; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
              .value { color: #18181b; font-size: 15px; }
              .message-box { background: #f4f4f5; padding: 15px; border-radius: 6px; margin-top: 10px; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">Ny melding fra kontaktskjema</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Fra</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">E-post</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Melding</div>
                  <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  Sendt via kontaktskjema på evjengaratun.no
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return res.status(200).json({
      success: true,
      messageId: data.id
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}
