import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in .env.local');
}

// Use service role key if available for admin tasks (like deleting users), otherwise use anon key
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

export const getServiceRoleClient = () => {
    if (!supabaseServiceRoleKey) {
        console.warn("SUPABASE_SERVICE_ROLE_KEY not found. Some test cleanup/setup might fail.");
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceRoleKey);
}
