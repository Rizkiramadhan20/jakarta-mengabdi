-- Fix for kakasaku_transactions table
-- Run this script in your Supabase SQL editor

-- First, drop the existing table with wrong foreign key
DROP TABLE IF EXISTS public.kakasaku_transactions CASCADE;

-- Recreate the table with correct foreign key reference
CREATE TABLE public.kakasaku_transactions (
  id uuid primary key default uuid_generate_v4(),
  kaka_saku_id integer references public.kakaSaku(id) on delete cascade,
  name text,
  email text,
  photo_url text,
  image_url text,
  amount numeric(12,2),
  status text,
  payment_type text,
  order_id text,
  transaction_time timestamp with time zone default timezone('utc'::text, now()),
  midtrans_response jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS kakasaku_transactions_kaka_saku_id_idx 
ON public.kakasaku_transactions (kaka_saku_id);

-- Enable RLS
ALTER TABLE public.kakasaku_transactions ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read kakasaku_transactions"
ON public.kakasaku_transactions
FOR SELECT
USING (true);

-- Policy for service role insert
CREATE POLICY "Allow service role insert kakasaku_transactions"
ON public.kakasaku_transactions
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy for service role delete
CREATE POLICY "Allow service role delete kakasaku_transactions"
ON public.kakasaku_transactions
FOR DELETE
TO service_role
USING (true);

-- Grant permissions
GRANT ALL ON public.kakasaku_transactions TO service_role;
GRANT SELECT ON public.kakasaku_transactions TO anon, authenticated; 