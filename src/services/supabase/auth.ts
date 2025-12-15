import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dietaryRestrictions?: string;
  tshirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  registrationNotes?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData) {
  const { error: signUpError, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    },
  });

  if (signUpError) {
    throw signUpError;
  }

  // Update profile with additional hackathon fields
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        dietary_restrictions: data.dietaryRestrictions,
        tshirt_size: data.tshirtSize,
        registration_notes: data.registrationNotes,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }
  }

  return authData;
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData) {
  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw error;
  }

  return authData;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw error;
  }

  return user;
}

/**
 * Get the current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update the current user's profile
 */
export async function updateProfile(updates: Partial<Profile>) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('No user logged in');
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  // Get the current language from localStorage (set by the app)
  const storedLanguage = typeof window !== 'undefined' 
    ? localStorage.getItem('i18nextLng') || 'en'
    : 'en';
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/${storedLanguage}/password-change`,
  });

  if (error) {
    throw error;
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
}

/**
 * Sign in with OAuth provider (Google, GitHub)
 */
export async function signInWithOAuth(provider: 'google' | 'github') {
  // Get the current language from localStorage (set by the app)
  const storedLanguage = typeof window !== 'undefined' 
    ? localStorage.getItem('i18nextLng') || 'en'
    : 'en';

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/${storedLanguage}`,
    },
  });

  if (error) {
    throw error;
  }
}
