-- supabase/migrations/0015_fix_admin_stats.sql

-- Fix the get_admin_stats function with proper security and syntax
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Security check: Only admins can call this
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT jsonb_build_object(
    'users_count', (SELECT count(*) FROM profiles),
    'products_count', (SELECT count(*) FROM products),
    'admins_count', (SELECT count(*) FROM admin_users),
    'interactions_count', (SELECT count(*) FROM interactions),
    'last_updated', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
