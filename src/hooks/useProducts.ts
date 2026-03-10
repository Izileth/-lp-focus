// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Product} from '../types';

// The Book type from src/types.ts is not up to date with the database schema.
// I will assume a more updated type for now.

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        setError("Database connection not available.");
        setLoading(false);
        return;
      }

      let query = supabase
        .from('products')
        .select('*, product_images(*)');

      if (categorySlug) {
        // Assuming category field matches or we have a slug field for categories
        // For now, let's filter by the category column.
        // We might need to handle slug-to-name conversion or use a category_slug field if it exists.
        query = query.ilike('category', categorySlug);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [categorySlug]);

  return { products, loading, error };
}
