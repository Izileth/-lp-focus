-- supabase/migrations/0028_create_cart_table.sql

-- 1. Create the cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Unique constraint to prevent duplicate products for the same user
  UNIQUE(user_id, product_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can only see their own cart items
CREATE POLICY "Users can view their own cart items"
ON cart_items FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert their own cart items"
ON cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart items"
ON cart_items FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete their own cart items"
ON cart_items FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all cart items
CREATE POLICY "Admins can view all cart items"
ON cart_items FOR SELECT
USING (is_admin());

-- 4. Trigger to update 'updated_at' on changes
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 5. Function to clear cart after checkout
CREATE OR REPLACE FUNCTION clear_user_cart(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM cart_items WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
