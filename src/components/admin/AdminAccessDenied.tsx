import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconAlertCircle, IconArrowLeft } from "../Icons";
import { stagger, fadeUp } from "./AdminVariants";

export function AdminAccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden pt-16">
      <div className="flex-1 flex items-center justify-center">
        <span
          aria-hidden="true"
          className="[font-family:'Playfair_Display',serif] absolute font-black select-none pointer-events-none text-white/[0.03] leading-none"
          style={{ fontSize: "clamp(120px,20vw,240px)" }}
        >
          403
        </span>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-8 max-w-[420px] flex flex-col items-center gap-6"
        >
          <motion.div variants={fadeUp}>
            <div className="w-12 h-12 border border-white/[0.14] flex items-center justify-center text-white/40">
              <IconAlertCircle size={20} />
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
            <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-white/30 border-l-2 border-white/20 pl-3">
              Acesso restrito
            </span>
            <h1
              className="[font-family:'Playfair_Display',serif] font-bold leading-[1.08] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(24px,3.5vw,38px)" }}
            >
              Área exclusiva
              <br />
              <em className="not-italic text-white/55">de administradores.</em>
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="font-sans font-light text-[13px] leading-[1.7] text-white/40 max-w-[300px]"
          >
            Você não possui permissão para acessar esta área.
            Entre em contato com o administrador do sistema.
          </motion.p>
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-3.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
          >
            <IconArrowLeft size={14} />
            Voltar à loja
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
