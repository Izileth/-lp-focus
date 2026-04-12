import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { IconArrowLeft, IconShield, IconMail, IconArrowRight } from "../components/Icons";
import type { Product } from "../types";

export function CheckoutDirectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product as Product | undefined;

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  if (!product) return null;

  const hasDiscount = Boolean(
    product.discount_price &&
    product.discount_price > 0 &&
    product.discount_price < product.price
  );

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price);

  const formattedDiscountPrice = product.discount_price
    ? new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(product.discount_price)
    : null;

  const handleConfirmOrder = () => {
    if (product.checkout_url) {
      window.location.href = product.checkout_url;
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white/20">
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
            to={`/livros/${product.slug}`}
            className="group inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition"
          >
            <span className="group-hover:-translate-x-1 transition">
              <IconArrowLeft />
            </span>
            Revisar Escolha
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-white/30 mb-4 block">
              Resumo do Pedido
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif leading-tight">
              Quase lá...
            </h1>
            <p className="text-white/50 leading-relaxed mb-10 text-[15px]">
              Você está prestes a adquirir um conteúdo exclusivo que transformará sua perspectiva.
              Revise os detalhes abaixo e prossiga para o pagamento seguro.
            </p>

            <div className="space-y-6 border-t border-white/10 pt-8">
              <div className="flex justify-between items-center text-[13px] tracking-wider uppercase text-white/40">
                <span>Produto</span>
                <span>Preço</span>
              </div>
              
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  {product.product_images?.[0] && (
                    <div className="w-16 h-20 flex-shrink-0 bg-white/[0.03] border border-white/10 overflow-hidden">
                      <img 
                        src={product.product_images[0].image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                    <p className="text-[11px] uppercase tracking-widest text-white/30">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  {hasDiscount ? (
                    <>
                      <span className="block text-white/30 line-through text-xs mb-1">
                        {formattedPrice}
                      </span>
                      <span className="text-xl font-serif font-bold text-emerald-400">
                        {formattedDiscountPrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-serif font-bold">
                      {formattedPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 text-white/40 text-[12px] tracking-wide">
                <IconShield className="text-emerald-500/50" />
                <span>Pagamento 100% seguro e criptografado</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 text-[12px] tracking-wide">
                <IconMail className="text-emerald-500/50" />
                <span>Acesso imediato enviado via e-mail</span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black border border-white/10 p-8 md:p-12"
          >
            <h2 className="text-[11px] tracking-[0.3em] uppercase text-white/30 mb-8 border-b border-white/10 pb-4">
              Confirmação
            </h2>
            
            <div className="space-y-8">
              <div className="flex justify-between items-baseline">
                <span className="text-white/50 font-serif italic">Total a pagar</span>
                <span className="text-4xl font-serif font-bold text-white">
                  {hasDiscount ? formattedDiscountPrice : formattedPrice}
                </span>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full bg-emerald-500 text-white font-bold text-[13px] tracking-[0.2em] uppercase py-5 px-8 flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all duration-300 group shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              >
                Confirmar Pedido
                <IconArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center pt-4">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                  Ao clicar em confirmar, você será redirecionado para o nosso parceiro de pagamentos oficial.
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
