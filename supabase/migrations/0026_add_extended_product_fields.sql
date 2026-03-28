-- supabase/migrations/0026_add_extended_product_fields.sql

-- 1. Add new columns to products table
ALTER TABLE products
ADD COLUMN subtitle TEXT,
ADD COLUMN author_note TEXT,
ADD COLUMN author_note_limit INTEGER DEFAULT 500,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- 2. Update create_product_with_images function
CREATE OR REPLACE FUNCTION create_product_with_images(
  name TEXT,
  description TEXT,
  price NUMERIC,
  category TEXT,
  badge TEXT,
  pages TEXT,
  image_urls TEXT[],
  slug TEXT,
  discount_price NUMERIC,
  language TEXT,
  rating NUMERIC,
  checkout_url TEXT DEFAULT NULL,
  access_url TEXT DEFAULT NULL,
  share_url TEXT DEFAULT NULL,
  bonuses JSONB DEFAULT '[]'::JSONB,
  video_url TEXT DEFAULT NULL,
  subtitle TEXT DEFAULT NULL,
  author_note TEXT DEFAULT NULL,
  author_note_limit INTEGER DEFAULT 500,
  is_featured BOOLEAN DEFAULT FALSE
)
RETURNS BIGINT AS $$
DECLARE
  new_product_id BIGINT;
BEGIN
  -- Insert the product
  INSERT INTO products (
    name, 
    description, 
    price, 
    category, 
    badge, 
    pages, 
    slug, 
    discount_price, 
    language, 
    rating,
    checkout_url,
    access_url,
    share_url,
    bonuses,
    video_url,
    subtitle,
    author_note,
    author_note_limit,
    is_featured
  )
  VALUES (
    name, 
    description, 
    price, 
    category, 
    badge, 
    pages, 
    slug, 
    discount_price, 
    language, 
    rating,
    checkout_url,
    access_url,
    share_url,
    bonuses,
    video_url,
    subtitle,
    author_note,
    author_note_limit,
    is_featured
  )
  RETURNING id INTO new_product_id;

  -- Insert the images
  IF array_length(image_urls, 1) > 0 THEN
    FOR i IN 1..array_length(image_urls, 1) LOOP
      INSERT INTO product_images (product_id, image_url)
      VALUES (new_product_id, image_urls[i]);
    END LOOP;
  END IF;

  RETURN new_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update update_product_with_images function
CREATE OR REPLACE FUNCTION update_product_with_images(
  id BIGINT,
  name TEXT,
  description TEXT,
  price NUMERIC,
  category TEXT,
  badge TEXT,
  pages TEXT,
  image_urls TEXT[],
  slug TEXT,
  discount_price NUMERIC,
  language TEXT,
  rating NUMERIC,
  checkout_url TEXT DEFAULT NULL,
  access_url TEXT DEFAULT NULL,
  share_url TEXT DEFAULT NULL,
  bonuses JSONB DEFAULT '[]'::JSONB,
  video_url TEXT DEFAULT NULL,
  subtitle TEXT DEFAULT NULL,
  author_note TEXT DEFAULT NULL,
  author_note_limit INTEGER DEFAULT 500,
  is_featured BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
  -- Update the product
  UPDATE products
  SET 
    name = update_product_with_images.name,
    description = update_product_with_images.description,
    price = update_product_with_images.price,
    category = update_product_with_images.category,
    badge = update_product_with_images.badge,
    pages = update_product_with_images.pages,
    slug = update_product_with_images.slug,
    discount_price = update_product_with_images.discount_price,
    language = update_product_with_images.language,
    rating = update_product_with_images.rating,
    checkout_url = update_product_with_images.checkout_url,
    access_url = update_product_with_images.access_url,
    share_url = update_product_with_images.share_url,
    bonuses = update_product_with_images.bonuses,
    video_url = update_product_with_images.video_url,
    subtitle = update_product_with_images.subtitle,
    author_note = update_product_with_images.author_note,
    author_note_limit = update_product_with_images.author_note_limit,
    is_featured = update_product_with_images.is_featured
  WHERE products.id = update_product_with_images.id;

  -- Delete old images
  DELETE FROM product_images WHERE product_id = update_product_with_images.id;

  -- Insert new images
  IF array_length(image_urls, 1) > 0 THEN
    FOR i IN 1..array_length(image_urls, 1) LOOP
      INSERT INTO product_images (product_id, image_url)
      VALUES (update_product_with_images.id, image_urls[i]);
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
