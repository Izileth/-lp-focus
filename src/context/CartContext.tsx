// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types';
import { useAuth } from '../hooks/useAuth';
import * as cartApi from '../api/cart';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const items = await cartApi.getCartItems(user.id);
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (productId: number, quantity: number = 1) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar itens ao carrinho');
      return;
    }
    try {
      await cartApi.addToCart(user.id, productId, quantity);
      await fetchCart();
      toast.success('Produto adicionado ao carrinho');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erro ao adicionar produto');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await cartApi.updateCartItemQuantity(id, quantity);
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Erro ao atualizar quantidade');
    }
  };

  const removeItem = async (id: string) => {
    try {
      await cartApi.removeFromCart(id);
      setCartItems(prev => prev.filter(item => item.id !== id));
      toast.success('Produto removido');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Erro ao remover produto');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartApi.clearCart(user.id);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Erro ao limpar carrinho');
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item.product?.discount_price || item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
