import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key Present:', !!supabaseServiceRoleKey);

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testUserCreation() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    
    console.log(`Attempting to create user: ${email}`);
    
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            first_name: 'Test',
            last_name: 'User'
        }
    });

    if (error) {
        console.error('Error creating user:', error);
    } else {
        console.log('User created successfully:', data.user.id);
        
        console.log('User created successfully:', data.user.id);
        
        // Test client-side access (RLS)
        console.log('Testing client-side access...');
        const clientSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        
        const { data: signInData, error: signInError } = await clientSupabase.auth.signInWithPassword({
            email,
            password
        });

        if (signInError) {
            console.error('Error signing in:', signInError);
        } else {
            console.log('Signed in successfully');
            
            const { data: clientProfile, error: clientProfileError } = await clientSupabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
                
            if (clientProfileError) {
                console.error('Error fetching profile as client (RLS issue?):', clientProfileError);
            } else {
                console.log('Profile found as client:', clientProfile);
            }
        }

        // Cleanup
        console.log('Deleting user...');
        const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id);
        if (deleteError) {
            console.error('Error deleting user:', deleteError);
        } else {
            console.log('User deleted successfully');
        }
    }
}

testUserCreation();
