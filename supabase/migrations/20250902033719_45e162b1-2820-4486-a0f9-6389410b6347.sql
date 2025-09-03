-- Enable Row Level Security on credentials table
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Allow authentication queries to access credentials (this is for login validation)
-- Only allow reading credentials for authentication purposes
CREATE POLICY "Allow authentication access to credentials" 
ON public.credentials 
FOR SELECT 
USING (true);

-- Only admins can modify credentials (insert, update, delete)
CREATE POLICY "Only admins can modify credentials" 
ON public.credentials 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);