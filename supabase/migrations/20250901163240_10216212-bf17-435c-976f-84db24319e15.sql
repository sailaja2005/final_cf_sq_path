-- Add password_changed column to credentials table to track first-time login
ALTER TABLE public.credentials 
ADD COLUMN password_changed BOOLEAN NOT NULL DEFAULT false;