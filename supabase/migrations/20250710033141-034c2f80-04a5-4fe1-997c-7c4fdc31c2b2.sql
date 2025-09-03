
-- Create a table for storing counseling assessments
CREATE TABLE public.counseling_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- General Information
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  age TEXT,
  gender TEXT,
  address TEXT,
  education TEXT,
  father_name TEXT,
  mother_name TEXT,
  guardian_name TEXT,
  father_occupation TEXT,
  mother_occupation TEXT,
  guardian_occupation TEXT,
  socio_economic_status TEXT,
  student_mobile TEXT,
  father_mobile TEXT,
  mother_mobile TEXT,
  guardian_mobile TEXT,
  student_email TEXT,
  father_email TEXT,
  mother_email TEXT,
  guardian_email TEXT,
  
  -- Family History
  family_history TEXT,
  annual_income TEXT,
  leadership_pattern TEXT,
  role_of_function TEXT[],
  communication TEXT,
  
  -- General Behaviour
  eating_habit TEXT,
  sleeping_habit TEXT,
  cleanliness_habit TEXT,
  dress_sense TEXT,
  approach_towards_faculty TEXT,
  consciousness_of_surroundings TEXT,
  in_touch_with_surroundings TEXT,
  approach_of_student TEXT,
  responsiveness_of_student TEXT,
  mannerism TEXT,
  
  -- Speech
  form_of_utterances TEXT,
  spontaneous TEXT,
  speech_mannerism TEXT,
  tone TEXT,
  speech TEXT,
  reaction_time TEXT,
  relevance_and_coherence TEXT,
  prosody TEXT,
  
  -- Thought
  flight_of_ideas TEXT,
  retardation_of_thinking TEXT,
  circumstantial TEXT,
  preservation TEXT,
  thought_blocks TEXT,
  obsession TEXT,
  hallucinations TEXT,
  delusions TEXT,
  sin_and_guilt TEXT,
  
  -- Feelings and emotions
  range TEXT,
  intensity_of_expression TEXT,
  reactivity TEXT,
  mood TEXT,
  diurnal_variations TEXT,
  congruity_with TEXT,
  appropriateness TEXT,
  liability TEXT,
  
  -- Cognitive
  level_of_awareness TEXT,
  insight TEXT,
  orientation TEXT,
  memory TEXT,
  intelligence TEXT,
  judgement TEXT,
  abstraction TEXT,
  
  -- Counselor's remarks and approval
  counselor_remarks TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Test completion tracking
  test_completed BOOLEAN NOT NULL DEFAULT false,
  test_completion_date DATE,
  personality_scores JSONB,
  personality_analysis TEXT[],
  
  -- Unique constraint on student name and roll number
  UNIQUE(student_name, roll_number)
);

-- Enable Row Level Security
ALTER TABLE public.counseling_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is for institutional use)
-- Note: In a production environment, you might want to add user authentication
CREATE POLICY "Allow public read access" ON public.counseling_assessments
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.counseling_assessments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.counseling_assessments
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON public.counseling_assessments
  FOR DELETE USING (true);

-- Create an index for faster lookups by student name and roll number
CREATE INDEX idx_counseling_assessments_student ON public.counseling_assessments(student_name, roll_number);

-- Create an index for status filtering
CREATE INDEX idx_counseling_assessments_status ON public.counseling_assessments(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_counseling_assessments_updated_at 
    BEFORE UPDATE ON public.counseling_assessments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
