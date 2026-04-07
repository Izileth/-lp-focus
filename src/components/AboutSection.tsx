// src/components/AboutSection.tsx
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "../motionVariants";

export function AboutSection() {
  return (
    <section id="sobre" className="px-10 py-[100px] border-b border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-between items-end mb-16 flex-wrap gap-6"
        >
          <div>
            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3"
            >
              Nossa Missão
            </motion.p>
            <motion.h2
              variants={fadeUpVariants}
              className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1]"
              style={{ fontSize: "clamp(32px,5vw,56px)" }}
            >
              Sobre
              <br />
              <em className="not-italic">Nós</em>
            </motion.h2>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-10 text-white/70 font-sans text-base leading-relaxed mb-12"
        >
          <motion.p variants={fadeUpVariants}>
            Na Focus Conhecimento, acreditamos que o acesso a informações de alta qualidade é a chave para o desenvolvimento pessoal e profissional...
          </motion.p>
          <motion.p variants={fadeUpVariants}>
            Selecionamos meticulosamente cada ebook, garantindo que o conteúdo seja relevante, prático e transformador...
          </motion.p>
        </motion.div>

        {/* CTA — estilo editorial */}
        <motion.div
          variants={fadeUpVariants}
          className="flex justify-start"
        >
          <a
            href="/artigos"
            className="group inline-flex flex-col items-start gap-2 text-white/80 hover:text-white transition-colors duration-300"
          >
            <span className="font-sans text-sm tracking-wide">
              Acessar artigos gratuitos
            </span>

            {/* Linha animada */}
            <span className="relative h-[1px] w-24 bg-white/20 overflow-hidden">
              <span className="absolute inset-0 bg-emerald-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}