-- supabase/migrations/0018_add_product_bonuses.sql

-- Add bonuses column to products table
ALTER TABLE products
ADD COLUMN bonuses JSONB DEFAULT '[]'::JSONB;

-- Update the create_product_with_images function to handle the new bonuses field
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
  bonuses JSONB DEFAULT '[]'::JSONB
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
    bonuses
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
    bonuses
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

-- Update the update_product_with_images function to handle the new bonuses field
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
  bonuses JSONB DEFAULT '[]'::JSONB
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
    bonuses = update_product_with_images.bonuses
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
