# OAuth Setup Guide

This guide explains how to configure OAuth providers (GitHub and Google) for the Hack4Change site.

## GitHub OAuth Setup

### Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"**
4. Fill in the application details:
   - **Application name**: `Hack4Change` (or your preferred name)
   - **Homepage URL**: `https://hack4change.ca` (or your domain)
   - **Authorization callback URL**: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
     - You can find your project reference in your Supabase dashboard URL
     - Example: If your Supabase project URL is `https://abcd1234.supabase.co`, your callback URL would be `https://abcd1234.supabase.co/auth/v1/callback`
5. Click **"Register application"**
6. On the next page, copy the **Client ID**
7. Click **"Generate a new client secret"** and copy the **Client Secret**

### Step 2: Configure GitHub in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **GitHub** in the list and click to expand
5. Toggle **"Enable Sign in with GitHub"** to ON
6. Enter the **Client ID** from Step 1
7. Enter the **Client Secret** from Step 1
8. Click **Save**

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top of the page
3. Click **"New Project"**
4. Enter a project name (e.g., `Hack4Change`)
5. Click **"Create"**
6. Wait for the project to be created, then select it from the project dropdown

### Step 2: Configure the OAuth Consent Screen

This is where you configure the scopes. Follow these steps carefully:

1. In the Google Cloud Console, go to **APIs & Services** → **OAuth consent screen** (in the left sidebar)
2. Select **External** as the user type (unless you have a Google Workspace organization)
3. Click **"Create"**

#### App Information (Screen 1):
- **App name**: `Hack4Change`
- **User support email**: Select your email from the dropdown
- **App logo**: Optional, can add later
- **App domain**: 
  - Application home page: `https://hack4change.ca`
  - Application privacy policy link: `https://hack4change.ca/privacy` (or leave blank for now)
  - Application terms of service: `https://hack4change.ca/terms` (or leave blank for now)
- **Authorized domains**: Click **"Add Domain"** and add `hack4change.ca`
- **Developer contact information**: Enter your email address
- Click **"Save and Continue"**

#### Scopes (Screen 2) - THIS IS THE IMPORTANT PART:

1. Click **"Add or Remove Scopes"**
2. In the search/filter box, search for and select these scopes:
   - `./auth/userinfo.email` - See your primary Google Account email address
   - `./auth/userinfo.profile` - See your personal info, including any personal info you've made publicly available
   - `openid` - Associate you with your personal info on Google
   
   **How to find them:**
   - Filter by: Type "email" → check `.../auth/userinfo.email`
   - Filter by: Type "profile" → check `.../auth/userinfo.profile`  
   - Filter by: Type "openid" → check `openid`

3. After selecting the three scopes, click **"Update"** at the bottom
4. You should see the scopes listed under "Your non-sensitive scopes"
5. Click **"Save and Continue"**

#### Test Users (Screen 3):
- If your app is in "Testing" mode, you need to add test users
- Click **"Add Users"**
- Enter email addresses of people who can test the OAuth flow
- Click **"Add"**
- Click **"Save and Continue"**

#### Summary (Screen 4):
- Review your settings
- Click **"Back to Dashboard"**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials** (in the left sidebar)
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**
4. Configure the OAuth client:
   - **Application type**: Web application
   - **Name**: `Hack4Change Web Client`
   - **Authorized JavaScript origins**: 
     - Click **"+ Add URI"** and add `http://localhost:3000`
   - **Authorized redirect URIs**: 
     - Click **"+ Add URI"** and add `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
5. Click **"Create"**
6. A popup will show your **Client ID** and **Client Secret** - copy both!

### Step 4: Configure Google in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click to expand
5. Toggle **"Enable Sign in with Google"** to ON
6. Enter the **Client ID** from Step 3
7. Enter the **Client Secret** from Step 3
8. Click **"Save"**

### Publishing Your App (Optional - For Production)

While in "Testing" mode, only users you've added as test users can sign in. To allow anyone to sign in:

1. Go to **OAuth consent screen**
2. Click **"Publish App"**
3. Confirm the publication

> **Note**: For apps requesting only basic scopes (email, profile, openid), Google typically doesn't require verification. If you add sensitive scopes later, you may need to go through Google's verification process.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click to expand
5. Toggle **"Enable Sign in with Google"** to ON
6. Enter the **Client ID** from Step 1
7. Enter the **Client Secret** from Step 1
8. Click **Save**

---

## Supabase Redirect URL Configuration

Make sure your Supabase project has the correct redirect URLs configured:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   - `http://localhost:3000/**` (development)

---

## Testing OAuth

After configuration:

1. Restart your development server (`npm run dev`)
2. Navigate to the sign-in page
3. Click "Sign in with GitHub" or "Sign in with Google"
4. You should be redirected to the OAuth provider
5. After authorization, you'll be redirected back to the app

### Troubleshooting

- **"Invalid redirect URI"**: Make sure the callback URL in your OAuth app settings exactly matches `https://<project-ref>.supabase.co/auth/v1/callback`
- **"OAuth provider not enabled"**: Check that the provider is enabled in Supabase Auth settings
- **User not created in profiles table**: You may need to set up a database trigger to create profile rows for OAuth users (similar to email/password users)
