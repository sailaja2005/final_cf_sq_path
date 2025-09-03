-- Create mentors table
CREATE TABLE public.mentors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    employee_id TEXT,
    department TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mentors table
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- Create policies for mentors table
CREATE POLICY "Anyone can view mentors" 
ON public.mentors 
FOR SELECT 
USING (true);

-- Add mentor_name column to students table if it doesn't exist
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS mentor_name TEXT,
ADD COLUMN IF NOT EXISTS academic_year INTEGER DEFAULT 1;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_mentor_name ON public.students(mentor_name);
CREATE INDEX IF NOT EXISTS idx_students_academic_year ON public.students(academic_year);

-- Create trigger for mentors updated_at
CREATE TRIGGER update_mentors_updated_at
    BEFORE UPDATE ON public.mentors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update personality_results to include more comprehensive analysis
ALTER TABLE public.personality_results 
ADD COLUMN IF NOT EXISTS detailed_analysis JSONB;