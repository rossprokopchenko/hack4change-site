# SMTP and Email Template Setup Guide

This guide explains how to connect an SMTP server to Supabase and how non-technical users can manage email templates.

## 1. SMTP Provider Setup (Resend)

We recommend using **Resend** for its simplicity and reliability.

1. **Create an Account**: Go to [resend.com](https://resend.com) and sign up.
2. **Verify Domain**: Add and verify your domain in the Resend dashboard.
3. **Generate API Key**:
    * **Go to API Keys**.
    * **Create a new key** with "Sending" permissions.
    * **Keep this key safe**. This will be your SMTP password.

## 2. Supabase Configuration

Once you have your Resend API Key, follow these steps in your [Supabase Dashboard](https://supabase.com/dashboard):

1. Select your project.
2. Go to **Project Settings > Auth**.
3. Scroll down to **SMTP Settings**.
4. Enable **External SMTP**.
5. Fill in the details:
    * **SMTP Host**: `smtp.resend.com`
    * **SMTP Port**: `587`
    * **SMTP User**: `resend`
    * **SMTP Password**: `YOUR_RESEND_API_KEY`
    * **Sender Name**: `Hack4Change Moncton`
    * **Sender Email**: `noreply@yourdomain.com` (Must be a verified domain in Resend)
6. Click **Save**.

## 3. Managing Email Templates (Non-Technical)

For people who don't want to touch code, we recommend using a visual email builder to design templates.

### Workflow

1. **Design**: Use a tool like [Stripo.email](https://stripo.email/) (free) or [Unlayer](https://unlayer.com/).
2. **Export**: Once the design is finished, use the "Export as HTML" or "Get Code" feature.
3. **Paste into Supabase**:
    * **In the Supabase Dashboard**, go to **Auth > Email Templates**.
    * **Select the template** you want to edit (e.g., "Confirm signup").
    * **Switch to the "HTML" view** if available, or just paste the code into the main box.
    * **Important**: Make sure to include the dynamic links in your HTML, such as `{{ .ConfirmationURL }}`.

## 4. Sample "Confirm Email" Template

Below is a professional, responsive HTML template you can use as a starting point. It uses the Hack4Change brand colors.

> [!NOTE]
> You can find the raw HTML for this template in `docs/templates/confirm_email.html`.

### Key Placeholders in Supabase

* `{{ .ConfirmationURL }}`: The link the user clicks to confirm their email.
* `{{ .Token }}`: The verification code (if using OTP).
* `{{ .Data.full_name }}`: If you collect names during sign-up.

## 5. Send Email AFTER Confirmation (Automated)

Supabase doesn't have a built-in template for a "Welcome" email sent *after* a user clicks the confirmation link. We have implemented a **Database Webhook** in the application to handle this.

### Configuration Steps

1. **Deploy the App**: Ensure your Next.js app is deployed and accessible from the internet (e.g., Vercel, VPS).
2. **Supabase Dashboard**:
    * **Go to Database > Webhooks**.
    * **Click Create a new webhook**.
    * **Name**: `send_welcome_email`
    * **Table**: `users` (Schema: `auth`)
    * **Events**: Select `UPDATE`.
    * **Webhook URL**: `https://your-domain.com/api/webhooks/supabase/auth`
    * **HTTP Method**: `POST`
3. **Click Save**.

### How it works

When a user clicks the confirmation link in their email, Supabase updates the `email_confirmed_at` field in the `auth.users` table. This triggers the webhook, which hits our API route. The application then uses your **Resend API Key** to send the "Welcome" email (template located at `docs/templates/welcome_email.html`).
