// src/api/cart.ts
import { supabase } from '../lib/supabaseClient';
import type { CartItem } from '../types';

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*, product_images(*))')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
};

export const addToCart = async (userId: string, productId: number, quantity: number = 1): Promise<CartItem> => {
  const { data, error } = await supabase
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: productId, quantity },
      { onConflict: 'user_id,product_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCartItemQuantity = async (id: string, quantity: number): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id);

  if (error) throw error;
};

export const removeFromCart = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const clearCart = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('clear_user_cart', { p_user_id: userId });
  if (error) throw error;
};
