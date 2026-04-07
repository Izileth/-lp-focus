// src/components/FreeAccessSection.tsx
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "../motionVariants";

export function FreeAccessSection() {
    return (
        <section className="px-10 mt-20 pb-[100px]">
            <div className="max-w-[900px] mx-auto">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center flex flex-col items-center gap-6"
                >
                    {/* Badge sutil */}
                    <motion.span
                        variants={fadeUpVariants}
                        className="text-[11px] tracking-[0.25em] uppercase text-white/30 font-sans"
                    >
                        Acesso Livre
                    </motion.span>

                    {/* Headline */}
                    <motion.h3
                        variants={fadeUpVariants}
                        className="[font-family:'Playfair_Display',serif] text-[28px] md:text-[36px] leading-[1.2] text-white"
                    >
                        Conhecimento de alto nível,
                        <br />
                        <em className="not-italic text-white/70">sem custo algum</em>
                    </motion.h3>

                    {/* Narrativa + prova social */}
                    <motion.p
                        variants={fadeUpVariants}
                        className="text-white/60 font-sans text-base leading-relaxed max-w-[640px]"
                    >
                        Centenas de leitores já utilizam nossos artigos como ponto de partida
                        para evoluir suas habilidades, tomar decisões mais inteligentes e
                        expandir sua visão de mundo. Todo o conteúdo é disponibilizado de forma
                        gratuita, com o mesmo nível de profundidade e curadoria aplicado aos
                        nossos materiais premium.
                    </motion.p>

                    <motion.span
                    
                        variants={fadeUpVariants}
                        className="text-white/50 text-sm italic"
                    >
                        * Sem necessidade de cadastro ou pagamento - 100% gratuito, para sempre.
                        
                    </motion.span>

                    {/* CTA editorial */}
                    <motion.a
                        variants={fadeUpVariants}
                        href="/artigos"
                        className="group mt-4 inline-flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                    >
                        <span className="font-sans text-sm tracking-wide">
                            Explorar artigos gratuitos
                        </span>

                        <span className="relative h-[1px] w-28 bg-white/20 overflow-hidden">
                            <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                        </span>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}