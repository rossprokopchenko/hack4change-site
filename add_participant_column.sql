-- Migration to add participant column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS participant BOOLEAN DEFAULT FALSE;

-- Update the handle_new_user function to include the participant field if needed
-- (Though default is false, it's good practice to keep it consistent)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url, participant)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url',
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
