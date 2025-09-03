-- Fix critical security vulnerability: Remove public access to credentials table
-- and create secure authentication function

-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Allow authentication access to credentials" ON public.credentials;

-- Create secure authentication function that doesn't expose credentials
CREATE OR REPLACE FUNCTION public.authenticate_user(
  email_param text,
  password_param text,
  role_param text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record record;
BEGIN
  -- Query credentials table securely
  SELECT id, gmail, role, password_changed
  INTO user_record
  FROM public.credentials
  WHERE gmail = email_param
    AND role = role_param::app_role
    AND password = password_param;
  
  -- Return result without exposing password
  IF user_record.id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'user', jsonb_build_object(
        'id', user_record.id,
        'gmail', user_record.gmail,
        'role', user_record.role
      ),
      'requiresPasswordChange', NOT user_record.password_changed
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid credentials'
    );
  END IF;
END;
$$;

-- Create secure password change function
CREATE OR REPLACE FUNCTION public.change_user_password(
  user_id_param uuid,
  current_password_param text,
  new_password_param text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record record;
BEGIN
  -- Verify current password
  SELECT password INTO user_record
  FROM public.credentials
  WHERE id = user_id_param
    AND password = current_password_param;
  
  IF user_record.password IS NOT NULL THEN
    -- Update password
    UPDATE public.credentials
    SET password = new_password_param,
        password_changed = true,
        updated_at = now()
    WHERE id = user_id_param;
    
    RETURN jsonb_build_object('success', true);
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Current password is incorrect'
    );
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.authenticate_user(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.change_user_password(uuid, text, text) TO authenticated;

-- Also grant to anon for login functionality
GRANT EXECUTE ON FUNCTION public.authenticate_user(text, text, text) TO anon;