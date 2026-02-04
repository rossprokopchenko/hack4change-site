import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Check for the Resend API key
const resendApiKey = process.env.SMTP_PASS;

export async function POST(request: Request) {
  try {
    if (!resendApiKey) {
      console.error('RESEND_API_KEY (SMTP_PASS) is not defined');
      return NextResponse.json({ error: 'Config error' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const payload = await request.json();

    console.log('Supabase Auth Webhook Payload:', JSON.stringify(payload, null, 2));

    const { type, table, record, old_record } = payload;

    // We only care about updates to the auth.users table
    if (table !== 'users') {
      return NextResponse.json({ message: 'Ignored table' }, { status: 200 });
    }

    if (type !== 'UPDATE') {
      return NextResponse.json({ message: 'Ignored operation type' }, { status: 200 });
    }

    // Detect if email_confirmed_at was just set (changed from null to a value)
    const justConfirmed = !old_record.email_confirmed_at && !!record.email_confirmed_at;

    if (!justConfirmed) {
      return NextResponse.json({ message: 'No confirmation detected' }, { status: 200 });
    }

    const email = record.email;
    const fullName = record.raw_user_meta_data?.first_name || 'Hacker';

    console.log(`Sending welcome email to ${email}...`);

    // Read the welcome template
    let htmlContent = '';
    try {
      const templatePath = path.join(process.cwd(), 'docs', 'templates', 'welcome_email.html');
      htmlContent = fs.readFileSync(templatePath, 'utf8');
      
      // Basic placeholder replacement if needed
      htmlContent = htmlContent.replace('Hi there,', `Hi ${fullName},`);
    } catch (err) {
      console.error('Error reading welcome template:', err);
      htmlContent = `<p>Welcome to Hack4Change Moncton! Your email ${email} has been confirmed.</p>`;
    }

    const senderEmail = process.env.SMTP_SENDER_EMAIL || 'noreply@hack4change.ca';
    const senderName = process.env.SMTP_SENDER_NAME || 'Hack4Change Moncton';

    const { data, error } = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: [email],
      subject: "You're in! Welcome to Hack4Change Moncton 🚀",
      html: htmlContent,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Welcome email sent', id: data?.id }, { status: 200 });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
