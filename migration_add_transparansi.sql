-- Migration: Add transparansi column to kakaSaku table
-- Run this script if your table already has data

-- Check if column exists first (optional safety check)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'kakaSaku' 
        AND column_name = 'transparansi'
    ) THEN
        -- Add the transparansi column
        ALTER TABLE public.kakaSaku 
        ADD COLUMN transparansi jsonb DEFAULT '[]'::jsonb;
        
        -- Add comment for documentation
        COMMENT ON COLUMN public.kakaSaku.transparansi IS 'Array of transparency documents/links';
        
        RAISE NOTICE 'Column transparansi added successfully to kakaSaku table';
    ELSE
        RAISE NOTICE 'Column transparansi already exists in kakaSaku table';
    END IF;
END $$;
