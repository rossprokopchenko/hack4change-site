# Notion Sync with Supabase Webhooks

This project uses Supabase Webhooks to automatically sync data from the `profiles` table to a Notion database in real-time.

## 🚀 Setup Instructions

To enable real-time sync, follow these steps in your Supabase Dashboard:

### 1. Enable Webhooks
Go to **Database > Webhooks** and click **Enable Webhooks** if it's not already active.

### 2. Create the Webhook
Click **Create Webhook** and fill in the following details:

- **Name**: `sync-notion`
- **Table**: `profiles`
- **Events**: Select `INSERT` and `UPDATE`.
- **Method**: `POST`
- **URL**: `https://your-production-domain.com/api/sync-notion`
- **Timeout**: `5000` (default)

### 3. Configure HTTP Headers
Add a header for authentication:
- **Name**: `Authorization`
- **Value**: `Bearer <your-CRON_SECRET>`

> [!TIP]
> You can find your `CRON_SECRET` in your `.env.local` file.

## 🔄 How it Works

1. **Trigger**: When a new user registers (INSERT) or updates their profile (UPDATE) in Supabase, a webhook is fired.
2. **API Route**: The event is sent to the `/api/sync-notion` route.
3. **Logic**: The API identifies the payload as a webhook event and syncs that specific profile to Notion immediately.

## 🛠 Manual Sync

Should you need to perform a full sync of all users (e.g., after a schema update), you can manually trigger it with:

```bash
curl -X POST https://your-production-domain.com/api/sync-notion \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 📝 Property Mapping

The sync maps the following `profiles` fields to Notion database properties:
- `first_name` → **First Name** (title)
- `last_name` → **Last Name** (rich_text)
- `email` → **Email** (email)
- `rsvp_status` → **RSVP Status** (status)
- `team_name` → **Team** (rich_text)
- `created_at` → **Created at** (date)
