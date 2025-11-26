import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase as supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import useAuth from "@/services/auth/use-auth";

// Explicitly cast to ensure types are picked up correctly
const supabase = supabaseClient as SupabaseClient<Database>;

export type RSVPStatus = "pending" | "confirmed" | "declined" | "waitlist";

export function useUpdateRSVP() {
  const { user } = useAuth();
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
    onSuccess: () => {
      // Invalidate auth queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
