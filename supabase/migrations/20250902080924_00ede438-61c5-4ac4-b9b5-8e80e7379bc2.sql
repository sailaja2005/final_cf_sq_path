
-- Remove the existing RLS policies that depend on Supabase auth
DROP POLICY IF EXISTS "Only admins can view all credentials" ON public.credentials;
DROP POLICY IF EXISTS "Only admins can insert credentials" ON public.credentials;
DROP POLICY IF EXISTS "Only admins can update credentials" ON public.credentials;
DROP POLICY IF EXISTS "Only admins can delete credentials" ON public.credentials;
DROP POLICY IF EXISTS "Only admins can modify credentials" ON public.credentials;

-- Create new policies that allow operations without Supabase auth dependency
CREATE POLICY "Allow credentials operations" 
ON public.credentials 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Also update other related tables to work without Supabase auth
DROP POLICY IF EXISTS "Only admins can view valid emails" ON public.valid_emails;
DROP POLICY IF EXISTS "Only admins can insert valid emails" ON public.valid_emails;

CREATE POLICY "Allow valid emails operations" 
ON public.valid_emails 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Update upload logs policies
DROP POLICY IF EXISTS "Admins can view all upload logs" ON public.upload_logs;

CREATE POLICY "Allow upload logs operations" 
ON public.upload_logs 
FOR ALL 
USING (true) 
WITH CHECK (true);
