// Quick test to verify Supabase connection
// Run this in browser console on http://localhost:3001

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Test if client can be created
import { supabase } from '@/lib/supabase/client';
console.log('Supabase client created:', !!supabase);

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    if (error) {
      console.error('Connection error:', error);
    } else {
      console.log('Connection successful!', data);
    }
  } catch (err) {
    console.error('Network error:', err);
  }
};

testConnection();
