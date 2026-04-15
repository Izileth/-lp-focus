// src/components/CartDrawer.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { IconX, IconTrash, IconMinus, IconPlus, IconShoppingCart, IconArrowRight } from "./Icons";
import { Link } from "react-router-dom";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[120] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconShoppingCart className="text-white/40" />
                <h2 className="text-lg font-medium tracking-tight">Seu Carrinho</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                    <IconShoppingCart size={32} />
                  </div>
                  <div>
                    <p className="text-white/60 font-medium">Seu carrinho está vazio</p>
                    <p className="text-white/30 text-sm mt-1">Adicione alguns produtos para começar.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    {/* Product Image */}
                    <div className="w-20 h-24 bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                      {item.product?.product_images?.[0]?.image_url ? (
                        <img
                          src={item.product.product_images[0].image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                          <IconShoppingCart size={24} />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium leading-tight line-clamp-2 pr-4 italic">
                            {item.product?.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                        <p className="text-[11px] text-white/30 mt-1 uppercase tracking-wider">
                          {item.product?.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-white/10 bg-black rounded-sm overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-white/5 text-white/40"
                          >
                            <IconMinus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/5 text-white/40"
                          >
                            <IconPlus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm font-bold">
                            R$ {((item.product?.discount_price || item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-white/[0.02] space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Subtotal</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-2xl  font-bold tracking-tighter [font-family:'Playfair_Display',serif] ">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full py-4 bg-white text-black text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                >
                  Finalizar Compra <IconArrowRight size={16} />
                </Link>
                
                <p className="text-[10px] text-center text-white/20 uppercase tracking-widest italic">
                  Ambiente Seguro & Criptografado
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
