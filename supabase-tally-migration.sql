-- Create event_form_submissions table
CREATE TABLE IF NOT EXISTS public.event_form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id TEXT NOT NULL, -- Using TEXT for now as no events table exists
  tally_submission_id TEXT UNIQUE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user only has one submission per event
  UNIQUE(user_id, event_id)
);

-- Function to check if form is submitted before allowing 'confirmed' status
CREATE OR REPLACE FUNCTION public.check_rsvp_form_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check if status is being changed to 'confirmed'
  IF NEW.rsvp_status = 'confirmed' AND (OLD.rsvp_status IS NULL OR OLD.rsvp_status != 'confirmed') THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.event_form_submissions
      WHERE user_id = NEW.id
    ) THEN
      RAISE EXCEPTION 'RSVP_FORM_REQUIRED';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for RSVP form check
DROP TRIGGER IF EXISTS on_profile_rsvp_update ON public.profiles;
CREATE TRIGGER on_profile_rsvp_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_rsvp_form_submission();

-- Enable RLS
ALTER TABLE public.event_form_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own submissions"
  ON public.event_form_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Admin policy
CREATE POLICY "Admins can view all submissions"
  ON public.event_form_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
