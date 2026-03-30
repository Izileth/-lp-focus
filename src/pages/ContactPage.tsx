import { Link } from "react-router-dom";
import { IconArrowLeft, IconMail } from "../components/Icons";
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "../motionVariants";

export default function ContactPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <main className="flex-grow pt-[140px] pb-24 px-8 md:px-16 max-w-[1200px] mx-auto w-full">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition-colors duration-200 mb-12"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">
            <IconArrowLeft />
          </span>
          Voltar para a home
        </Link>

        <div className="text-center max-w-[800px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3"
            >
              Suporte e Atendimento
            </motion.p>
            <motion.h1
              variants={fadeUpVariants}
              className="[font-family:'Playfair_Display',serif] text-[40px] md:text-[56px] font-bold leading-tight mb-8"
            >
              Entre em <em className="not-italic">Contato</em>
            </motion.h1>

            <motion.div variants={fadeUpVariants} className="flex flex-col items-center gap-6 text-white/70 font-sans text-lg">
              <p>
                Tem alguma dúvida sobre nossos ebooks ou precisa de suporte com sua compra?
                Nossa equipe está pronta para ajudar você.
              </p>
              
              <div className="w-full h-px bg-white/10 my-4" />

              <div className="flex flex-col items-center gap-2">
                <span className="text-white/40 text-sm uppercase tracking-widest">E-mail</span>
                <a
                  href="mailto:contato@focusconhecimento.com"
                  className="flex items-center gap-3 text-2xl text-white hover:text-white/80 transition-colors underline underline-offset-8 decoration-white/20"
                >
                  <IconMail size={24} /> contato@focusconhecimento.com
                </a>
              </div>

              <p className="mt-8 text-sm text-white/40">
                Horário de atendimento: Segunda a Sexta, das 9h às 18h.
                <br />
                Prazo de resposta: até 24 horas úteis.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
