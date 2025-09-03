-- Enable RLS on all remaining tables that need it

-- Enable RLS on tables that don't have it yet
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_portal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valid_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_portal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_questions ENABLE ROW LEVEL SECURITY;

-- Set proper search_path for functions to fix security warnings
ALTER FUNCTION public.validate_signup_email(text, text) SET search_path = public;
ALTER FUNCTION public.hash_password(text) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_portal_tables() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;