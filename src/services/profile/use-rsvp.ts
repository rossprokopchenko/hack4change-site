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

      const isDevMode = process.env.NEXT_PUBLIC_TALLY_DEV_MODE === "true";

      const performUpdate = async () => {
        const { error } = await (supabase
          .from("profiles" as any) as any)
          .update({ rsvp_status: status })
          .eq("id", user.id);
        return error;
      };

      let error = await performUpdate();

      if (error && error.message?.includes("RSVP_FORM_REQUIRED") && isDevMode) {
        console.log("RSVP: Trigger blocked update in Dev Mode. Attempting dummy insertion...");
        
        // In dev mode, auto-insert a dummy submission if blocked by trigger
        const { error: insertError } = await (supabase
          .from("event_form_submissions" as any) as any)
          .insert({
            user_id: user.id,
            event_id: "hack4change-2026",
            tally_submission_id: `dev_${Date.now()}`
          });
        
        if (insertError) {
          console.error("RSVP: Dev Mode insert failed. This is likely an RLS policy issue.", {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details
          });
          
          // If insert fails due to RLS, the update retry below will also fail with RSVP_FORM_REQUIRED
        } else {
          console.log("RSVP: Dummy insertion reported success. Verifying record exists...");
          
          const { data: verifyRow } = await (supabase
            .from("event_form_submissions" as any) as any)
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();
            
          if (!verifyRow) {
            console.error("RSVP: Dummy insertion returned success but record could not be found! RLS may be dropping the row silently.");
          } else {
            console.log("RSVP: Dummy record confirmed. Retrying profile update...");
          }
        }
        
        // Retry the update
        error = await performUpdate();
      }

      if (error) {
        if (error.message?.includes("RSVP_FORM_REQUIRED")) {
          throw new Error("FORM_REQUIRED");
        }
        throw error;
      }

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
