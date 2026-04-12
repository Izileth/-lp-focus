-- supabase/migrations/0027_create_payments_table.sql

-- Create the payments table to store structured transaction data
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_id TEXT UNIQUE, -- Stripe PaymentIntent ID (pi_...)
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  tax_id TEXT, -- CPF/CNPJ
  amount INTEGER NOT NULL, -- Amount in CENTS (as Stripe uses)
  currency TEXT DEFAULT 'brl',
  payment_method TEXT NOT NULL, -- 'card', 'pix', 'boleto'
  status TEXT NOT NULL, -- 'requires_payment_method', 'requires_action', 'processing', 'succeeded', 'canceled', etc.
  client_secret TEXT, -- Stripe Client Secret for frontend confirmation
  metadata JSONB DEFAULT '{}'::jsonb, -- Store next_action, pix data, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can insert payments (from the frontend checkout)
CREATE POLICY "Anyone can insert payments"
ON payments FOR INSERT
WITH CHECK (true);

-- RLS Policy: Only admins can view all payments
CREATE POLICY "Admins can view payments"
ON payments FOR SELECT
USING (auth.uid() IN (SELECT id FROM profiles WHERE slug = 'admin' OR extra_info->>'role' = 'admin'));

-- Trigger to update 'updated_at' on changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update get_admin_stats to include payments count
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'users_count', (SELECT count(*) FROM profiles),
    'products_count', (SELECT count(*) FROM products),
    'admins_count', (SELECT count(*) FROM profiles WHERE extra_info->>'role' = 'admin'),
    'interactions_count', (SELECT count(*) FROM interactions),
    'articles_count', (SELECT count(*) FROM articles),
    'visits_count', (SELECT count(*) FROM interactions WHERE type = 'page_view'),
    'payments_count', (SELECT count(*) FROM payments)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
