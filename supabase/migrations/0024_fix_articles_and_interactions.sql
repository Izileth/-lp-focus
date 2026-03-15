-- supabase/migrations/0024_fix_articles_and_interactions.sql

-- 1. Fix interactions table and get_admin_stats if 0011 failed
CREATE TABLE IF NOT EXISTS interactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type TEXT NOT NULL,
  target_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure RLS is enabled
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Re-apply policies safely
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert interactions') THEN
        CREATE POLICY "Anyone can insert interactions" ON interactions FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view interactions') THEN
        CREATE POLICY "Admins can view interactions" ON interactions FOR SELECT USING (is_admin());
    END IF;
END $$;

-- Fix get_admin_stats (re-re-applying to be sure)
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT jsonb_build_object(
    'users_count', (SELECT count(*) FROM profiles),
    'products_count', (SELECT count(*) FROM products),
    'admins_count', (SELECT count(*) FROM admin_users),
    'interactions_count', (SELECT count(*) FROM interactions),
    'articles_count', (SELECT count(*) FROM articles),
    'last_updated', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Article Functions to support content_format

-- Update create_article
CREATE OR REPLACE FUNCTION create_article(
  p_title TEXT,
  p_content TEXT,
  p_excerpt TEXT DEFAULT NULL,
  p_image_url TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_is_published BOOLEAN DEFAULT FALSE,
  p_author_id UUID DEFAULT NULL,
  p_content_format TEXT DEFAULT 'html'
)
RETURNS UUID AS $$
DECLARE
  v_article_id UUID;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;

  INSERT INTO articles (
    title,
    content,
    excerpt,
    image_url,
    category,
    tags,
    is_published,
    published_at,
    author_id,
    content_format
  )
  VALUES (
    p_title,
    p_content,
    p_excerpt,
    p_image_url,
    p_category,
    p_tags,
    p_is_published,
    CASE WHEN p_is_published THEN NOW() ELSE NULL END,
    COALESCE(p_author_id, auth.uid()),
    p_content_format
  )
  RETURNING id INTO v_article_id;

  RETURN v_article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update update_article
CREATE OR REPLACE FUNCTION update_article(
  p_id UUID,
  p_title TEXT,
  p_content TEXT,
  p_excerpt TEXT,
  p_image_url TEXT,
  p_category TEXT,
  p_tags TEXT[],
  p_is_published BOOLEAN,
  p_content_format TEXT DEFAULT 'html'
)
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;

  UPDATE articles
  SET
    title = p_title,
    content = p_content,
    excerpt = p_excerpt,
    image_url = p_image_url,
    category = p_category,
    tags = p_tags,
    is_published = p_is_published,
    content_format = p_content_format,
    published_at = CASE 
      WHEN p_is_published = TRUE AND (is_published = FALSE OR published_at IS NULL) THEN NOW() 
      WHEN p_is_published = FALSE THEN NULL
      ELSE published_at 
    END,
    updated_at = NOW()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
