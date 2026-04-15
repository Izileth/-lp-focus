// src/pages/SuccessRedemptionPage.tsx
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { IconCheckCircle, IconDownload, IconMail, IconArrowRight, IconShield, IconLock } from "../components/Icons";

export function SuccessRedemptionPage() {
  const location = useLocation();
  const { orderId, email, items } = location.state || {};

  return (
    <div className="bg-black min-h-screen text-white font-sans pt-[104px] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      <main className="relative z-10 max-w-[800px] mx-auto px-6 py-12 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <IconCheckCircle size={40} />
          </div>

          <span className="text-[11px] tracking-[0.4em] uppercase text-emerald-500 font-bold mb-4 block">
            Pagamento Confirmado
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif tracking-tight italic">
            Seu acesso está <br />liberado.
          </h1>
          
          <p className="text-white/50 text-lg mb-12 max-w-[600px] mx-auto leading-relaxed">
            Parabéns pela sua aquisição. O conteúdo já foi enviado para <span className="text-white font-medium">{email || "seu e-mail"}</span>. 
            Você também pode acessar as áreas de membros abaixo.
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl text-left hover:border-emerald-500/30 transition-all group">
              <IconMail className="text-emerald-500 mb-4" size={24} />
              <h3 className="font-bold mb-2">Acesso via E-mail</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Enviamos os links de acesso e nota fiscal diretamente para sua caixa de entrada.
              </p>
              <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-2">
                Verificar Inbox <IconArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl text-left hover:border-emerald-500/30 transition-all group">
              <IconDownload className="text-emerald-500 mb-4" size={24} />
              <h3 className="font-bold mb-2">Download Imediato</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Se o seu produto for um arquivo digital, o download já está disponível no painel.
              </p>
              <Link to="/profile" className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-2">
                Ir para Perfil <IconArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Order Details Footer */}
          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
            <div className="flex items-center gap-4">
              <IconShield size={16} />
              <span className="text-[10px] uppercase tracking-[0.2em]">Compra 100% Protegida</span>
            </div>
            <div className="flex items-center gap-4">
              <IconLock size={16} />
              <span className="text-[10px] uppercase tracking-[0.2em]">ID do Pedido: {orderId?.substring(0, 8) || "ORD-0122"}</span>
            </div>
          </div>

          <Link
            to="/"
            className="mt-16 inline-block text-[11px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
          >
            Voltar para a Página Inicial
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
