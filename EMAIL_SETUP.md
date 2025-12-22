# Email Setup Guide for Evjen & Garatun Website

This guide will help you set up the contact form email functionality using Resend.

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Once logged in, go to **API Keys** in the Resend dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "Evjen Garatun Production")
4. Select the permissions (default "Sending access" is fine)
5. Click **Create**
6. **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!

## Step 3: Configure Vercel Environment Variables

### Option A: Via Vercel Dashboard (Recommended)

1. Go to your project on [Vercel](https://vercel.com)
2. Click on **Settings**
3. Click on **Environment Variables**
4. Add a new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Paste your Resend API key (starts with `re_`)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your site for the changes to take effect

### Option B: Via Vercel CLI

```bash
vercel env add RESEND_API_KEY
# Paste your API key when prompted
# Select all environments
```

## Step 4: Verify Your Domain (Optional but Recommended)

By default, Resend uses `onboarding@resend.dev` as the sender. To use your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `evjengaratun.no`)
4. Follow the DNS configuration instructions
5. Once verified, update the `from` field in `/api/send-email.js`:
   ```javascript
   from: 'Evjen & Garatun <noreply@evjengaratun.no>',
   ```

## Step 5: Update Recipient Email

Edit `/api/send-email.js` and change the `to` field to your actual business email:

```javascript
to: 'kontakt@evjengaratun.no', // Your actual email here
```

## Step 6: Test the Form

1. Go to your website
2. Fill out the contact form
3. Submit it
4. Check your inbox for the email
5. Check Resend dashboard for delivery status

## Troubleshooting

### "Failed to send email" error
- Verify the `RESEND_API_KEY` environment variable is set correctly in Vercel
- Check that you've redeployed after adding the environment variable
- Look at Vercel Function Logs for detailed error messages

### Email not arriving
- Check your spam folder
- Verify the recipient email in the code is correct
- Check Resend dashboard for delivery status and errors

### API key issues
- Make sure the API key starts with `re_`
- Ensure there are no extra spaces when pasting
- Generate a new API key if the old one isn't working

## Free Tier Limits

Resend free tier includes:
- **100 emails per day**
- **3,000 emails per month**
- Email support

This should be more than enough for a business contact form!

## Local Development Testing

To test locally:

1. Create a `.env` file (copy from `.env.example`)
2. Add your Resend API key
3. Install Vercel CLI: `npm i -g vercel`
4. Run: `vercel dev`
5. Test the form at `http://localhost:3000`

**Note**: Never commit your `.env` file to Git!

## Support

- Resend Documentation: [https://resend.com/docs](https://resend.com/docs)
- Vercel Environment Variables: [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
