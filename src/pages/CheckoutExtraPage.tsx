// src/pages/CheckoutExtraPage.tsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { IconArrowLeft, IconShield, IconMail, IconArrowRight, IconShoppingCart } from "../components/Icons";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";

export function CheckoutDirectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice, totalItems, removeItem, loading: cartLoading } = useCart();
  
  // Suporte para compra direta de um único produto (via state do navigate)
  const directProduct = location.state?.product as Product | undefined;

  // Se não houver produto direto e o carrinho estiver vazio (e não estiver carregando), volta para a home
  useEffect(() => {
    if (!directProduct && cartItems.length === 0 && !cartLoading) {
      navigate("/");
    }
  }, [directProduct, cartItems, cartLoading, navigate]);

  const handleConfirmOrder = () => {
    if (directProduct?.checkout_url) {
      window.location.href = directProduct.checkout_url;
    } else if (cartItems.length > 0) {
      // Aqui integraria com o link de checkout do bundle ou do primeiro item
      // Como estamos focando no funcional de exibição:
      const mainCheckoutUrl = cartItems[0].product?.checkout_url;
      if (mainCheckoutUrl) {
        window.location.href = mainCheckoutUrl;
      }
    }
  };

  const displayItems = directProduct 
    ? [{ id: 'direct', product: directProduct, quantity: 1 }] 
    : cartItems;

  const displayTotal = directProduct 
    ? (directProduct.discount_price || directProduct.price) 
    : totalPrice;

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(displayTotal);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white/20 pt-[104px]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none z-0" />

      <main className="relative z-10 max-w-[1000px] mx-auto px-6 py-12 md:py-24">

        {/* Header */}
        <div className="mb-12 z-50">
          <Link
            to={directProduct ? `/livros/${directProduct.slug}` : "/"}
            className="group inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition"
          >
            <span className="group-hover:-translate-x-1 transition">
              <IconArrowLeft />
            </span>
            {directProduct ? "Revisar Escolha" : "Continuar Comprando"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Items Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/30 mb-4 block">
              Resumo do Pedido ({directProduct ? 1 : totalItems} {totalItems === 1 ? 'item' : 'itens'})
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif leading-tight">
              Quase lá...
            </h1>
            
            <div className="space-y-6 border-t border-white/10 pt-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              <div className="flex justify-between items-center text-[13px] tracking-wider uppercase text-white/40 mb-4">
                <span>Produtos</span>
                <span>Subtotal</span>
              </div>
              
              {displayItems.map((item) => {
                const p = item.product;
                if (!p) return null;
                const price = p.discount_price || p.price;
                
                return (
                  <div key={item.id} className="flex justify-between items-start gap-4 group">
                    <div className="flex gap-4">
                      {p.product_images?.[0] && (
                        <div className="w-16 h-20 flex-shrink-0 bg-white/[0.03] border border-white/10 overflow-hidden">
                          <img 
                            src={p.product_images[0].image_url} 
                            alt={p.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-[15px] leading-tight mb-1 italic">{p.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/30">{p.category}</p>
                        <p className="text-[11px] text-white/40 mt-2">Qtd: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-serif font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price * item.quantity)}
                      </span>
                      {!directProduct && (
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="block text-[10px] text-red-500/40 hover:text-red-500 transition-colors uppercase tracking-tighter mt-2 ml-auto"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-3 text-white/40 text-[12px] tracking-wide">
                <IconShield size={16} className="text-emerald-500/50" />
                <span>Pagamento 100% seguro e criptografado</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 text-[12px] tracking-wide">
                <IconMail size={16} className="text-emerald-500/50" />
                <span>Acesso imediato enviado via e-mail</span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Totals Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black border border-white/10 p-8 md:p-12 sticky top-32"
          >
            <h2 className="text-[11px] tracking-[0.3em] uppercase text-white/30 mb-8 border-b border-white/10 pb-4 flex items-center gap-2">
              <IconShoppingCart size={14} /> Fechamento
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-white/40">
                  <span>Subtotal</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-white/40">
                  <span>Taxas / Entrega</span>
                  <span className="text-emerald-500 uppercase text-[10px] font-bold tracking-widest">Grátis</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-white/5">
                  <span className="text-white/50 font-serif italic">Total Final</span>
                  <span className="text-4xl font-serif font-bold text-white tracking-tighter">
                    {formattedTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full bg-emerald-500 text-white font-bold text-[13px] tracking-[0.2em] uppercase py-5 px-8 flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all duration-300 group shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              >
                Finalizar Pedido
                <IconArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center pt-4">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                  Ao finalizar, você será redirecionado para o ambiente seguro de pagamento.
                </p>
              </div>

              <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/20">Suporte</span>
                  <span className="text-[11px] text-white/50">WhatsApp / E-mail</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/20">Garantia</span>
                  <span className="text-[11px] text-white/50">7 Dias Incondicional</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
