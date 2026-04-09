import { supabase } from '../lib/supabaseClient';
import type { Product, Bonus } from '../types';

export async function fetchProducts(categorySlug?: string) {
  if (!supabase) throw new Error("Database connection not available.");

  let query = supabase
    .from('products')
    .select('*, product_images(*)');

  if (categorySlug) {
    query = query.ilike('category', categorySlug);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function fetchProductBySlug(slug: string) {
  if (!supabase) throw new Error("Database connection not available.");

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function createProduct(productData: {
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  slug?: string;
  language: string;
  rating: number;
  category: string;
  badge: string;
  pages: string;
  image_urls: string[];
  checkout_url?: string;
  access_url?: string;
  share_url?: string;
  video_url?: string;
  bonuses?: Bonus[];
}) {
  if (!supabase) throw new Error("Database connection not available.");
  const { data, error } = await supabase.rpc('create_product_with_images', productData);
  return { data, error };
}

export async function updateProduct(productId: number, productData: {
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  slug: string;
  language: string;
  rating: number;
  category: string;
  badge: string;
  pages: string;
  image_urls: string[];
  checkout_url?: string;
  access_url?: string;
  share_url?: string;
  video_url?: string;
  bonuses?: Bonus[];
}) {
  if (!supabase) throw new Error("Database connection not available.");
  const { data, error } = await supabase.rpc('update_product_with_images', {
    ...productData,
    id: productId
  });
  return { data, error };
}

export async function deleteProduct(productId: number) {
  if (!supabase) throw new Error("Database connection not available.");
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  return { data, error };
}
