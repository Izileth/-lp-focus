
// src/pages/DirectCheckoutPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconLock, IconShield, IconCheckCircle, IconArrowRight, IconCreditCard, IconLoader } from "../components/Icons";
import { useProducts } from "../hooks/useProducts";
import { paymentsApi } from "../api/payments";
import type { Product } from "../types";

export function DirectCheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  useEffect(() => {
    if (products && slug) {
      const found = products.find(p => p.slug === slug);
      if (found) setProduct(found);
    }
  }, [products, slug]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    setStep("processing");

    try {
      await paymentsApi.processPayment({
        productId: product.id,
        amount: product.discount_price || product.price,
        customerName: formData.name,
        customerEmail: formData.email,
        paymentMethod: "card"
      });
      setStep("success");
    } catch (error) {
      alert("Erro no pagamento. Tente novamente.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Lado Esquerdo: Info do Produto */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-8"
        >
          <div>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-emerald-500 mb-4 block font-bold">Checkout Seguro</span>
            <h1 className="[font-family:'Playfair_Display',serif] text-4xl md:text-5xl font-bold leading-tight">
              Finalize sua <br />aquisição.
            </h1>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl flex gap-6 items-center">
             <div className="w-24 aspect-[3/4] bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                {product.product_images?.[0] && (
                  <img src={product.product_images[0]} alt={product.name} className="w-full h-full object-cover" />
                )}
             </div>
             <div>
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-white/40 text-sm mb-4">{product.category}</p>
                <div className="flex flex-col">
                  <span className="text-emerald-500 font-bold text-xl">R${product.discount_price || product.price} BRL</span>
                  <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Pagamento Único</span>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/40 text-sm">
              <IconShield size={18} className="text-emerald-500" />
              <span>Criptografia de ponta a ponta</span>
            </div>
            <div className="flex items-center gap-4 text-white/40 text-sm">
              <IconLock size={18} className="text-emerald-500" />
              <span>Processamento via API Privada</span>
            </div>
          </div>
        </motion.div>

        {/* Lado Direito: Checkout Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white text-black rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onSubmit={handlePayment} 
                className="flex flex-col gap-6"
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-6">Dados de Pagamento</h2>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Nome no Cartão</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black/5 border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
                      placeholder="JOÃO SILVA"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">E-mail para entrega</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-black/5 border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Número do Cartão</label>
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        className="w-full bg-black/5 border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors pr-10"
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                      />
                      <IconCreditCard size={20} className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Validade</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-black/5 border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
                        placeholder="MM/AA"
                        value={formData.expiry}
                        onChange={e => setFormData({...formData, expiry: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">CVV</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-black/5 border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={e => setFormData({...formData, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-xl font-sans text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 mt-4 hover:bg-black/90 transition-all active:scale-[0.98]"
                >
                  Confirmar Pagamento <IconArrowRight size={16} />
                </button>
              </motion.form>
            )}

            {step === "processing" && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center py-20 text-center"
              >
                <IconLoader size={48} className="text-emerald-500 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Processando...</h3>
                <p className="text-black/40">Estamos conectando à sua rede de pagamentos segura.</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8">
                  <IconCheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-emerald-600">Sucesso!</h3>
                <p className="text-black/60 mb-8 leading-relaxed px-6">
                  Seu pagamento foi confirmado. Verifique seu e-mail para acessar o conteúdo.
                </p>
                <button 
                  onClick={() => navigate("/")}
                  className="bg-black text-white px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest"
                >
                  Voltar para o Início
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
