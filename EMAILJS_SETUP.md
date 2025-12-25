# EmailJS Setup Guide

This guide will help you configure EmailJS to send emails when users submit the registration form.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add an Email Service

1. In your EmailJS dashboard, click on "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your chosen provider
5. **Important**: Copy the **Service ID** - you'll need this later

## Step 3: Create an Email Template

1. In your EmailJS dashboard, click on "Email Templates"
2. Click "Create New Template"
3. Use the following template structure:

### Template Configuration:

**Template Name**: `netlink_contact_form` (or any name you prefer)

**Subject**: `New Registration from {{from_name}}`

**Content**:
```
New registration received from Netlink website!

Name: {{from_name}}
Phone: {{from_phone}}
Industries: {{industries}}

---
This email was sent from the Netlink registration form.
```

**From Name**: `Netlink Website`

**From Email**: Use your verified email address

**To Email**: `{{to_email}}` (this will be populated from the form submission)

4. Click "Save" and copy the **Template ID**

## Step 4: Get Your Public Key

1. In your EmailJS dashboard, go to "Account" → "General"
2. Find your **Public Key** (also called User ID)
3. Copy this key

## Step 5: Configure Environment Variables

1. Create a `.env` file in the root directory of your project (same level as package.json)
2. Copy the content from `.env.example`
3. Replace the placeholder values with your actual EmailJS credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

**Example:**
```env
VITE_EMAILJS_SERVICE_ID=service_abc123xyz
VITE_EMAILJS_TEMPLATE_ID=template_xyz789abc
VITE_EMAILJS_PUBLIC_KEY=xYz123AbC456DeF
```

## Step 6: Test the Integration

1. Save your `.env` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Fill out the registration form on your website
4. Submit the form
5. Check your email inbox for the notification

## Email Template Variables

The form sends the following variables to EmailJS:

- `{{from_name}}` - The name entered in the form
- `{{from_phone}}` - The phone number entered in the form
- `{{industries}}` - Comma-separated list of selected industries
- `{{to_email}}` - The receiving email address (contact@netlinkad.com)

## Customizing the Email Template

You can customize your email template in the EmailJS dashboard:

1. Go to "Email Templates"
2. Click on your template
3. Modify the content using the variables listed above
4. You can also add HTML formatting for better-looking emails
5. Save your changes

### Example HTML Template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: #00ff00; margin: 0;">New Registration</h2>
  </div>

  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
      You have received a new registration from the Netlink website:
    </p>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Name:</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">{{from_name}}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Phone:</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">{{from_phone}}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Industries:</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">{{industries}}</td>
      </tr>
    </table>

    <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      This email was sent automatically from the Netlink registration form.
    </p>
  </div>
</div>
```

## Troubleshooting

### Email not sending?

1. **Check console errors**: Open browser DevTools and check for errors
2. **Verify credentials**: Make sure all three values in `.env` are correct
3. **Check EmailJS dashboard**: Go to "Auto-Reply Monitor" to see if requests are being received
4. **Email service limits**: Free EmailJS accounts have a limit of 200 emails/month

### Still receiving Google Sheets data?

Yes! The integration keeps both EmailJS and Google Sheets functionality. If you want to remove Google Sheets integration, you can delete lines 162-175 in `src/presentation/mobile/MobileApp.tsx`.

### Need to change the receiving email?

Update line 151 in `src/presentation/mobile/MobileApp.tsx`:
```typescript
to_email: 'contact@netlinkad.com', // Change this to your desired email
```

## Security Notes

- **Never commit your `.env` file** to version control (it's already in `.gitignore`)
- Keep your EmailJS credentials private
- EmailJS Public Key is safe to use in frontend code
- For production, consider setting environment variables in your hosting platform

## Support

For more information, visit:
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)
