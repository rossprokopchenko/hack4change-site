import { useCallback } from "react";
import { supabase as supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import { User } from "../api/types/user";
import HTTP_CODES_ENUM from "../api/types/http-codes";
import useAuth from "../auth/use-auth";
import { RoleEnum } from "../api/types/role";

const supabase = supabaseClient as SupabaseClient<Database>;

export function useSupabaseAuthPatchMeService() {
  const { user } = useAuth();

  return useCallback(async (data: any) => {
    if (!user?.id) {
        return { status: 401, data: null };
    }

    try {
      const updates: any = {};
      if (data.firstName) updates.first_name = data.firstName;
      if (data.lastName) updates.last_name = data.lastName;
      if (data.photo) updates.avatar_url = data.photo.path;

      if (Object.keys(updates).length > 0) {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

          if (error) throw error;
      }
      
      if (data.password) {
          const { error } = await supabase.auth.updateUser({
              password: data.password
          });
          if (error) throw error;
      }

      if (data.email && data.email !== user.email) {
          const { error } = await supabase.auth.updateUser({
              email: data.email
          });
          if (error) throw error;
      }

      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
       if (fetchError) throw fetchError;

       const p = profile as any;

       const updatedUser: User = {
          id: p.id,
          email: p.email,
          firstName: p.first_name || "",
          lastName: p.last_name || "",
          photo: p.avatar_url ? { id: "", path: p.avatar_url } : undefined,
          role: {
            id: p.role === 'admin' ? RoleEnum.ADMIN : RoleEnum.USER,
            name: p.role === 'admin' ? 'Admin' : 'User',
          },
          rsvpStatus: p.rsvp_status,
        };

      return {
        status: HTTP_CODES_ENUM.OK,
        data: updatedUser,
      };

    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        status: HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY,
        data: { errors: { server: 'Update failed' } },
      };
    }
  }, [user]);
}
