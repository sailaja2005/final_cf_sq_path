-- Create mentor_portal_data table
CREATE TABLE public.mentor_portal_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  test_status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(roll_no)
);

-- Create admin_portal_data table
CREATE TABLE public.admin_portal_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  test_status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(roll_no)
);

-- Enable RLS on both tables
ALTER TABLE public.mentor_portal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_portal_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (as per existing pattern)
CREATE POLICY "Allow all access to mentor_portal_data" 
ON public.mentor_portal_data 
FOR ALL 
USING (true);

CREATE POLICY "Allow all access to admin_portal_data" 
ON public.admin_portal_data 
FOR ALL 
USING (true);

-- Populate mentor_portal_data with completed tests
INSERT INTO public.mentor_portal_data (name, roll_no, test_status)
SELECT DISTINCT name, roll_no, 'Completed'
FROM public.personality_results
WHERE name IS NOT NULL AND roll_no IS NOT NULL
ON CONFLICT (roll_no) DO UPDATE SET 
  test_status = 'Completed',
  updated_at = now();

-- Populate admin_portal_data with completed tests
INSERT INTO public.admin_portal_data (name, roll_no, test_status)
SELECT DISTINCT name, roll_no, 'Completed'
FROM public.personality_results
WHERE name IS NOT NULL AND roll_no IS NOT NULL
ON CONFLICT (roll_no) DO UPDATE SET 
  test_status = 'Completed',
  updated_at = now();

-- Create trigger to automatically update portal tables when personality_results is inserted
CREATE OR REPLACE FUNCTION update_portal_tables()
RETURNS TRIGGER AS $$
BEGIN
  -- Update mentor portal
  INSERT INTO public.mentor_portal_data (name, roll_no, test_status)
  VALUES (NEW.name, NEW.roll_no, 'Completed')
  ON CONFLICT (roll_no) DO UPDATE SET 
    test_status = 'Completed',
    updated_at = now();
  
  -- Update admin portal
  INSERT INTO public.admin_portal_data (name, roll_no, test_status)
  VALUES (NEW.name, NEW.roll_no, 'Completed')
  ON CONFLICT (roll_no) DO UPDATE SET 
    test_status = 'Completed',
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on personality_results
CREATE TRIGGER update_portal_tables_trigger
  AFTER INSERT ON public.personality_results
  FOR EACH ROW
  WHEN (NEW.name IS NOT NULL AND NEW.roll_no IS NOT NULL)
  EXECUTE FUNCTION update_portal_tables();