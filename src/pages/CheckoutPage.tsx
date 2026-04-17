// src/pages/CheckoutPage.tsx
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
} from "../components/Icons";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import { paymentsApi } from "../api/payments";
import type { Product } from "../types";
import type { PaymentResponse, PaymentError} from "../api/payments";

export function CheckoutPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice: cartTotalPrice, clearCart, loading: cartLoading } = useCart();

  // Captura produto de compra direta (via state ou slug)
  const stateProduct = location.state?.product as Product | undefined;
  const { product: fetchedProduct, loading: fetchingProduct } = useProduct(stateProduct ? undefined : slug);
  const directProduct = stateProduct || fetchedProduct;

  // Estados do Checkout
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "pix" | "boleto" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">("card");
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);

  // Dados do Formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    taxId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    line1: "",
    city: "",
    state: "",
    postal_code: ""
  });

  const isCartCheckout = !directProduct;
  const itemsToDisplay = isCartCheckout
    ? cartItems.map(item => ({ product: item.product, quantity: item.quantity }))
    : [{ product: directProduct, quantity: 1 }];

  const totalAmount = isCartCheckout
    ? cartTotalPrice
    : (directProduct?.discount_price || directProduct?.price || 0);

  useEffect(() => {
    if (!directProduct && cartItems.length === 0 && !cartLoading && !slug && !fetchingProduct) {
      navigate("/");
    }
  }, [directProduct, cartItems, cartLoading, slug, fetchingProduct, navigate]);

  if (fetchingProduct || cartLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <IconLoader className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalAmount);



  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsToDisplay.length === 0) return;

    setLoading(true);
    setStep("processing");

    try {
      // Alinhado com @docs/PAYMENTS_STRIPE_API_GUIDE.md
      // Note: O amount deve ser enviado em REAIS para a paymentsApi, 
      // pois ela interna faz a conversão para centavos (* 100).
      const response = await paymentsApi.processPayment({
        productId: itemsToDisplay[0].product?.id.toString() || "0",
        amount: totalAmount, 
        currency: "brl",
        customerName: formData.name,
        customerEmail: formData.email,
        paymentMethod: paymentMethod,
        taxId: formData.taxId,
        line1: formData.line1,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code
      });

      setPaymentResult(response);

      // Mapeamento de Status conforme Guia
      if (response.status === "succeeded") {
        await clearCart();
        navigate("/success", { 
          state: { 
            orderId: response.id, 
            email: formData.email,
            items: itemsToDisplay 
          } 
        });
      } else if (response.status === "requires_action") {
        const nextAction = response.nextAction;
        
        if (nextAction?.type === "display_pix_qr_code") {
          setStep("pix");
        } else if (paymentMethod === "boleto") {
          setStep("boleto");
        } else if (nextAction?.redirectToUrl) {
          // Para 3D Secure ou Redirecionamentos Genéricos
          window.location.href = nextAction.redirectToUrl;
        }
      } else if (response.status === "processing") {
        // Para boletos que demoram a processar ou análise de fraude
        alert("Seu pagamento está sendo processado. Você receberá um e-mail em breve.");
        navigate("/");
      } else if (response.status === "requires_payment_method") {
        throw new Error("O pagamento não pôde ser processado. Tente outro método ou verifique os dados.");
      }
    } catch (error: PaymentError | unknown) {
      const msg = (error as Error).message || "Ops! Algo deu errado com seu pagamento. Tente novamente ou use outro método.";
      alert(msg);
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Código copiado!");
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white/20 pt-[104px]">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none z-0" />

      <main className="relative z-10 max-w-[1100px] mx-auto px-6 py-12 md:py-24">
        <div className="mb-12">
          <Link
            to={directProduct ? `/livros/${directProduct.slug}` : "/"}
            className="group inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition"
          >
            <span className="group-hover:-translate-x-1 transition">
              <IconArrowLeft />
            </span>
            {directProduct ? "Revisar Escolha" : "Voltar para a Loja"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[11px] tracking-[0.3em] uppercase text-emerald-500 mb-4 block font-bold">Checkout Seguro</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif leading-tight">
              Resumo do <br />seu pedido.
            </h1>

            <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {itemsToDisplay.map((item, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/10 p-4 rounded-xl flex gap-4 items-center">
                  <div className="w-16 aspect-[3/4] bg-white/5 rounded overflow-hidden flex-shrink-0">
                    {item.product?.product_images?.[0] && (
                      <img src={item.product.product_images[0].image_url} alt={item.product.name} className="w-full h-full object-cover grayscale" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1 italic line-clamp-1">{item.product?.name}</h3>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest">{item.product?.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-white/50">Qtd: {item.quantity}</span>
                      <span className="text-emerald-500 font-bold text-sm">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.product?.discount_price || item.product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4 text-white/40 text-sm">
                <IconShield size={18} className="text-emerald-500" />
                <span>Criptografia de ponta a ponta</span>
              </div>
              <div className="flex items-center gap-4 text-white/40 text-sm">
                <IconLock size={18} className="text-emerald-500" />
                <span>Processamento Seguro via Stripe</span>
              </div>
              <div className="flex items-center gap-4 text-white/40 text-sm">
                <IconMail size={18} className="text-emerald-500" />
                <span>Acesso imediato via e-mail</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white text-black rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === "form" && (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleConfirmOrder} className="flex flex-col gap-6">
                  <h2 className="text-xl font-bold mb-6">Dados de Pagamento</h2>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {["card", "boleto"].map((m) => (
                      <button key={m} type="button" onClick={() => setPaymentMethod(m as "card" | "boleto")} className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${paymentMethod === m ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/20'}`}>
                        {m === "card" ? <IconCreditCard size={20} /> : <IconMail size={20} />}
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{m === "card" ? "Cartão" : m.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Nome Completo</label>
                      <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="JOÃO SILVA" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">E-mail para entrega</label>
                      <input required type="email" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    {(paymentMethod !== "card") && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">CPF / CNPJ</label>
                          <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="000.000.000-00" value={formData.taxId} onChange={e => setFormData({ ...formData, taxId: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Endereço (Rua, nº)</label>
                          <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="Rua Exemplo, 123" value={formData.line1} onChange={e => setFormData({ ...formData, line1: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Cidade</label>
                            <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="São Paulo" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Estado (UF)</label>
                            <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="SP" maxLength={2} value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">CEP</label>
                          <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="00000-000" value={formData.postal_code} onChange={e => setFormData({ ...formData, postal_code: e.target.value })} />
                        </div>
                      </div>
                    )}
                    {paymentMethod === "card" && (
                      <div className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Número do Cartão</label>
                          <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={e => setFormData({ ...formData, cardNumber: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="MM/AA" value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })} />
                          <input required type="text" className="w-full border-b-2 border-black/10 px-0 py-2 focus:border-black outline-none transition-colors" placeholder="CVV" value={formData.cvv} onChange={e => setFormData({ ...formData, cvv: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-black/5">
                    <div className="flex justify-between items-baseline mb-6">
                      <span className="text-black/40 font-serif italic text-sm">Total a pagar</span>
                      <span className="text-3xl font-serif font-bold text-black">{formattedTotal}</span>
                    </div>
                    <button disabled={loading} className="w-full bg-black text-white py-5 rounded-xl font-sans text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black/90 transition-all active:scale-[0.98]">
                      {paymentMethod === 'card' ? 'Confirmar Pagamento' : 'Gerar Boleto'}
                      <IconArrowRight size={16} />
                    </button>
                  </div>
                </motion.form>
              )}

              {step === "processing" && (
                <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <IconLoader size={48} className="text-emerald-500 animate-spin mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Processando...</h3>
                  <p className="text-black/40">Conectando ao ambiente seguro...</p>
                </motion.div>
              )}

              {step === "pix" && paymentResult?.nextAction?.display_pix_qr_code && (
                <motion.div key="pix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-4">
                  <h3 className="font-bold text-lg mb-8">Pagamento via PIX</h3>
                  <div className="bg-white p-4 rounded-2xl border-2 border-black/5 mb-8">
                    <img src={paymentResult.nextAction.display_pix_qr_code.image_url_png} alt="QR Code PIX" className="w-48 h-48" />
                  </div>
                  <button onClick={() => copyToClipboard(paymentResult.nextAction!.display_pix_qr_code!.data)} className="w-full bg-black/5 hover:bg-black/10 text-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest mb-4">Copiar Código PIX</button>
                  <button onClick={() => setStep("success")} className="w-full bg-emerald-500 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">Já paguei <IconCheckCircle size={16} /></button>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8"><IconCheckCircle size={40} /></div>
                  <h3 className="text-3xl font-bold mb-4 text-emerald-600">Sucesso!</h3>
                  <p className="text-black/60 mb-8 px-6">Seu pagamento foi confirmado. Verifique seu e-mail para acessar o conteúdo.</p>
                  <button onClick={() => navigate("/")} className="bg-black text-white px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest">Voltar para o Início</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}