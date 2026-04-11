// src/components/CtaSection.tsx
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import { IconShield, IconMail, IconZap, IconArrowRight } from "./Icons";

export function CtaSection() {
  return (
    <section className="px-10 py-[100px] relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-[700px] mx-auto text-center relative"
      >
        <motion.p
          variants={fadeUpVariants}
          className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-5"
        >
          Comece Hoje
        </motion.p>

        <motion.h2
          variants={fadeUpVariants}
          className="[font-family:'Playfair_Display',serif] font-black leading-[1] tracking-[-0.02em] mb-6"
          style={{ fontSize: "clamp(36px,6vw,64px)" }}
        >
          Investir em Você
          <br />
          <em className="not-italic text-white/70">é o melhor retorno.</em>
        </motion.h2>

        <motion.p
          variants={fadeUpVariants}
          className="font-sans font-light text-base leading-[1.7] text-white/45 mb-12"
        >
          Cada ensinamento é entregue diretamente no seu e-mail após a compra.
          Pagamento simples e seguro via Caktos Pay.
        </motion.p>

        {/* Trust badges */}
        <motion.div
          variants={fadeUpVariants}
          className="flex justify-center gap-6 mb-10 flex-wrap"
        >
          {[
            { icon: <IconShield />, label: "Pagamento seguro"  },
            { icon: <IconMail />,   label: "Entrega imediata"  },
            { icon: <IconZap />,    label: "Acesso vitalício"  },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/35 font-sans text-[11px] tracking-wide">
              <span>{icon}</span>
              {label}
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeUpVariants} className="flex gap-4 justify-center flex-wrap">
          <motion.a
            href="#livros"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="bg-emerald-500 text-white font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 flex items-center gap-2 hover:bg-emerald-600 transition-colors"
          >
            Explorar catálogo <IconArrowRight />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            className="border border-white/25 text-white font-sans text-[13px] tracking-[0.1em] uppercase px-7 py-3.5 hover:border-white/60 hover:bg-white/[0.04] transition-[border-color,background]"
          >
            Falar com suporte
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
