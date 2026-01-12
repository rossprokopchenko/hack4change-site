import { useQuery } from "@tanstack/react-query";
import { supabase as supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import useAuth from "@/services/auth/use-auth";

const supabase = supabaseClient as SupabaseClient<Database>;

export function useFormSubmission(eventId: string = "hack4change-2026") {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["form-submission", user?.id, eventId],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("event_form_submissions" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}
