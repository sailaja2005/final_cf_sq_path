-- Fix RLS policies for counseling_assessments to work with credentials-based authentication

-- Enable RLS if not already enabled
ALTER TABLE public.counseling_assessments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that check profiles table
DROP POLICY IF EXISTS "Counselors can insert assessments" ON public.counseling_assessments;
DROP POLICY IF EXISTS "Counselors can update assessments" ON public.counseling_assessments;
DROP POLICY IF EXISTS "Counselors can view all assessments" ON public.counseling_assessments;
DROP POLICY IF EXISTS "Only counselors can delete assessments" ON public.counseling_assessments;

-- Create new policies that work with the current authentication system
-- Allow anyone to insert assessments (since we're using credentials-based auth, not Supabase auth)
CREATE POLICY "Allow assessments insert" 
ON public.counseling_assessments 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update assessments
CREATE POLICY "Allow assessments update" 
ON public.counseling_assessments 
FOR UPDATE 
USING (true);

-- Allow anyone to view assessments
CREATE POLICY "Allow assessments select" 
ON public.counseling_assessments 
FOR SELECT 
USING (true);

-- Allow anyone to delete assessments
CREATE POLICY "Allow assessments delete" 
ON public.counseling_assessments 
FOR DELETE 
USING (true);

-- Also ensure personality tables work properly
-- Enable RLS on personality_responses if needed
ALTER TABLE public.personality_responses ENABLE ROW LEVEL SECURITY;

-- Drop restrictive policies and create permissive ones for personality_responses
DROP POLICY IF EXISTS "Counselors and admins can view all personality responses" ON public.personality_responses;
DROP POLICY IF EXISTS "Counselors can view all responses" ON public.personality_responses;
DROP POLICY IF EXISTS "Only authorized users can insert personality responses" ON public.personality_responses;

-- Create new permissive policies for personality_responses
CREATE POLICY "Allow personality responses insert" 
ON public.personality_responses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow personality responses select" 
ON public.personality_responses 
FOR SELECT 
USING (true);

-- Enable RLS on personality_results if needed
ALTER TABLE public.personality_results ENABLE ROW LEVEL SECURITY;

-- Drop restrictive policies and create permissive ones for personality_results
DROP POLICY IF EXISTS "Counselors and admins can view all personality results" ON public.personality_results;
DROP POLICY IF EXISTS "Counselors can view all results" ON public.personality_results;
DROP POLICY IF EXISTS "Only authorized users can insert personality results" ON public.personality_results;

-- Create new permissive policies for personality_results
CREATE POLICY "Allow personality results insert" 
ON public.personality_results 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow personality results select" 
ON public.personality_results 
FOR SELECT 
USING (true);