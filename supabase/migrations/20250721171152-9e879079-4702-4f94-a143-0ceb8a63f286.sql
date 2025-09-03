-- Add name and roll_no fields to personality_results table
ALTER TABLE public.personality_results 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS roll_no TEXT;