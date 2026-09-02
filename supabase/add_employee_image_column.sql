-- Add missing image column to employees table
-- Run this in the Supabase SQL Editor if you already created the employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS image text;
