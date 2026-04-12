import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  IconArrowLeft, 
  IconShield, 
  IconMail, 
  IconArrowRight, 
  IconLock, 
  IconCheckCircle, 
  IconCreditCard, 
  IconLoader,
  IconSmartphone,
  IconDownload,
} from "../components/Icons";
import { useProduct } from "../hooks/useProduct";
import { paymentsApi} from "../api/payments";
import type { Product } from "../types";
import type { PaymentResponse, PaymentError } from "../api/payments";
export function CheckoutPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try to get product from state or from hook if slug exists
  const stateProduct = location.state?.product as Product | undefined;
  const { product: fetchedProduct, loading: fetchingProduct } = useProduct(stateProduct ? undefined : slug);
  
  const product = stateProduct || fetchedProduct;

  // Checkout states
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "pix" | "boleto" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">("card");
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    taxId: "", // CPF/CNPJ
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  useEffect(() => {
    if (!product && !slug && !fetchingProduct) {
      navigate("/");
    }
  }, [product, slug, fetchingProduct, navigate]);

  if (fetchingProduct) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <IconLoader className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

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

  const currentPrice = product.discount_price || product.price;
  const displayPrice = hasDiscount ? formattedDiscountPrice : formattedPrice;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    setStep("processing");

    try {
      const response = await paymentsApi.processPayment({
        productId: product.id.toString(),
        amount: currentPrice,
        currency: "BRL",
        customerName: formData.name,
        customerEmail: formData.email,
        paymentMethod: paymentMethod,
        taxId: formData.taxId
      });

      setPaymentResult(response);

      if (response.status === "succeeded") {
        setStep("success");
      } else if (response.nextAction) {
        if (response.nextAction.type === "display_pix_qr_code") {
          setStep("pix");
        } else if (paymentMethod === "boleto") {
          setStep("boleto");
        }
      } else if (paymentMethod === "card" && response.clientSecret) {
        // Aqui entraria a confirmação do Stripe Elements
        // Por enquanto simulamos sucesso ou mantemos em processamento
        setStep("success");
      }
    } catch (error: PaymentError | unknown) {
      alert((error as PaymentError).message || "Erro no pagamento. Tente novamente.");
      setStep("form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado para a área de transferência!");
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

      <main className="relative z-10 max-w-[1100px] mx-auto px-6 py-12 md:py-24">

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
            <span className="text-[11px] tracking-[0.3em] uppercase text-emerald-500 mb-4 block font-bold">
              Checkout Seguro
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif leading-tight">
              Finalize sua <br />aquisição.
            </h1>
            <p className="text-white/50 leading-relaxed mb-10 text-[15px]">
              Você está prestes a adquirir um conteúdo exclusivo que transformará sua perspectiva.
              Preencha os dados ao lado para concluir seu acesso.
            </p>

            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl flex gap-6 items-center mb-10">
              <div className="w-24 aspect-[3/4] bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                {product.product_images?.[0] && (
                  <img 
                    src={product.product_images[0].image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-white/40 text-sm mb-4">{product.category}</p>
                <div className="flex flex-col">
                  <span className="text-emerald-500 font-bold text-xl">{displayPrice} BRL</span>
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
                <span>Processamento via Stripe (Seguro)</span>
              </div>
              <div className="flex items-center gap-4 text-white/40 text-sm">
                <IconMail size={18} className="text-emerald-500" />
                <span>Acesso imediato enviado via e-mail</span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white text-black rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {step === "form" && (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  onSubmit={handleConfirmOrder} 
                  className="flex flex-col gap-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-6">Dados de Pagamento</h2>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${paymentMethod === 'card' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/20'}`}
                      >
                        <IconCreditCard size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Cartão</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${paymentMethod === 'pix' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/20'}`}
                      >
                        <IconSmartphone size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">PIX</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("boleto")}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${paymentMethod === 'boleto' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/20'}`}
                      >
                        <IconMail size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Boleto</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Nome Completo</label>
                      <input 
                        required
                        type="text" 
                        className="w-full  border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
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
                        className="w-full border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    {(paymentMethod === "boleto" || paymentMethod === "pix") && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">CPF / CNPJ</label>
                        <input 
                          required
                          type="text" 
                          className="w-full border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
                          placeholder="000.000.000-00"
                          value={formData.taxId}
                          onChange={e => setFormData({...formData, taxId: e.target.value})}
                        />
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Número do Cartão</label>
                          <div className="relative">
                            <input 
                              required={paymentMethod === "card"}
                              type="text" 
                              className="w-full border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors pr-10"
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
                              required={paymentMethod === "card"}
                              type="text" 
                              className="w-fullborder-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
                              placeholder="MM/AA"
                              value={formData.expiry}
                              onChange={e => setFormData({...formData, expiry: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">CVV</label>
                            <input 
                              required={paymentMethod === "card"}
                              type="text" 
                              className="w-full border-b-2 border-black/10 px-0 py-3 focus:border-black outline-none transition-colors"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={e => setFormData({...formData, cvv: e.target.value})}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-black/40 font-serif italic text-sm">Total a pagar</span>
                      <span className="text-3xl font-serif font-bold text-black">
                        {displayPrice}
                      </span>
                    </div>

                    <button 
                      disabled={loading}
                      className="w-full bg-black text-white py-5 rounded-xl font-sans text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black/90 transition-all active:scale-[0.98]"
                    >
                      {paymentMethod === 'card' ? 'Confirmar Pagamento' : 
                       paymentMethod === 'pix' ? 'Gerar PIX' : 'Gerar Boleto'} 
                      <IconArrowRight size={16} />
                    </button>
                  </div>

                  <p className="text-[9px] text-black/30 uppercase tracking-[0.1em] text-center leading-relaxed">
                    Pagamento <span className="text-emerald-500 font-bold">100% seguro</span> processado de forma segura pelo Stripe. <br />
                    Acesso imediato para Cartão e PIX.
                  </p>
                </motion.form>
              )}

              {step === "processing" && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center py-20 text-center"
                >
                  <IconLoader size={48} className="text-emerald-500 animate-spin mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Processando...</h3>
                  <p className="text-black/40">Estamos conectando à rede de pagamentos segura do Stripe.</p>
                </motion.div>
              )}

              {step === "pix" && paymentResult?.nextAction?.display_pix_qr_code && (
                <motion.div 
                  key="pix"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-4"
                >
                  <div className="w-full flex items-center justify-between mb-8 border-b border-black/5 pb-4">
                    <h3 className="font-bold text-lg">Pagamento via PIX</h3>
                    <span className="text-emerald-500 font-bold">{displayPrice}</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border-2 border-black/5 mb-8">
                    <img 
                      src={paymentResult.nextAction.display_pix_qr_code.image_url_png} 
                      alt="QR Code PIX" 
                      className="w-48 h-48"
                    />
                  </div>

                  <div className="w-full space-y-4">
                    <p className="text-center text-[11px] text-black/50 leading-relaxed px-4">
                      Escaneie o código acima com o app do seu banco ou utilize o botão abaixo para copiar o código "PIX Copia e Cola".
                    </p>

                    <button 
                      onClick={() => copyToClipboard(paymentResult.nextAction!.display_pix_qr_code!.data)}
                      className="w-full bg-black/5 hover:bg-black/10 text-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors"
                    >
                      Copiar Código PIX
                    </button>

                    <button 
                      onClick={() => setStep("success")}
                      className="w-full bg-emerald-500 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      Já realizei o pagamento <IconCheckCircle size={16} />
                    </button>
                    
                    <button 
                      onClick={() => setStep("form")}
                      className="w-full text-black/40 text-[10px] font-bold uppercase tracking-widest py-2"
                    >
                      Alterar método de pagamento
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "boleto" && (
                <motion.div 
                  key="boleto"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-4"
                >
                  <div className="w-full flex items-center justify-between mb-8 border-b border-black/5 pb-4">
                    <h3 className="font-bold text-lg">Boleto Gerado</h3>
                    <span className="text-blue-500 font-bold">{displayPrice}</span>
                  </div>

                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-8">
                    <IconMail size={40} />
                  </div>

                  <div className="w-full space-y-6">
                    <p className="text-center text-[12px] text-black/60 leading-relaxed px-4">
                      Seu boleto foi gerado com sucesso e enviado para seu e-mail. Você também pode baixar o PDF agora mesmo.
                    </p>

                    {paymentResult?.nextAction?.redirectToUrl && (
                      <a 
                        href={paymentResult.nextAction.redirectToUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-500 text-white py-5 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
                      >
                        Baixar PDF do Boleto <IconDownload size={16} />
                      </a>
                    )}

                    <div className="bg-black/5 p-6 rounded-2xl space-y-3">
                      <span className="text-[10px] uppercase font-bold text-black/40 tracking-widest block">Informações Importantes</span>
                      <ul className="space-y-2">
                        <li className="text-[11px] text-black/70 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                          Vencimento em 3 dias úteis.
                        </li>
                        <li className="text-[11px] text-black/70 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                          Acesso liberado após compensação (até 72h).
                        </li>
                      </ul>
                    </div>

                    <button 
                      onClick={() => navigate("/")}
                      className="w-full bg-black text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                    >
                      Voltar para o Início
                    </button>
                  </div>
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
                    Seu pagamento foi confirmado. Verifique seu e-mail para acessar o conteúdo imediatamente.
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
      </main>
    </div>
  );
}
