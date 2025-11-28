import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";

// Explicitly cast to ensure types are picked up correctly
const supabase = supabaseClient as SupabaseClient<Database>;

export type RSVPStatus = "pending" | "confirmed" | "declined" | "waitlist";

export function useUpdateRSVP() {
  const { user } = useAuth();
  const { setUser } = useAuthActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: RSVPStatus) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ rsvp_status: status })
        .eq("id", user.id);

      if (error) throw error;

      return status;
    },
    onSuccess: (status) => {
      // Update local user state immediately for UI responsiveness
      if (user) {
        setUser({
          ...user,
          rsvpStatus: status,
        });
      }
      // Invalidate auth queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
