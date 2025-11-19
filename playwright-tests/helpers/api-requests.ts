import { expect } from "@playwright/test";
import { supabase, getServiceRoleClient } from "./supabase";

export async function apiCreateNewUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  // Try to use service role client to create a confirmed user directly if possible
  const adminClient = getServiceRoleClient();
  
  if (adminClient) {
      const { error } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
              first_name: firstName,
              last_name: lastName
          }
      });
      if (error) throw error;
      return;
  }

  // Fallback to regular sign up (user will be unconfirmed)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
      throw error;
  }
}

export async function deleteUserByEmail(email: string) {
    const adminClient = getServiceRoleClient();
    if (!adminClient) return;

    const { data: users } = await adminClient.auth.admin.listUsers();
    const user = users.users.find(u => u.email === email);
    
    if (user) {
        await adminClient.auth.admin.deleteUser(user.id);
    }
}

