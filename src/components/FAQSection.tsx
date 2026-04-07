// src/components/FAQSection.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "../motionVariants";

const FAQ_ITEMS = [
    {
        question: "Os artigos são realmente gratuitos?",
        answer:
            "Sim. Todo o conteúdo disponível nesta seção pode ser acessado livremente, sem qualquer custo. Acreditamos que o conhecimento deve ser acessível, e utilizamos nossos artigos como porta de entrada para uma experiência mais profunda dentro da plataforma.",
    },
    {
        question: "Qual a diferença entre os artigos e os ebooks?",
        answer:
            "Os artigos oferecem conteúdos diretos, práticos e aplicáveis no dia a dia. Já os ebooks aprofundam cada tema de forma estruturada, com metodologias completas e estratégias detalhadas para transformação real.",
    },
    {
        question: "Esse conteúdo realmente faz diferença?",
        answer:
            "Leitores utilizam nossos materiais como base para tomada de decisões, evolução pessoal e desenvolvimento de novas habilidades. Nosso foco não é volume, mas sim profundidade e aplicabilidade.",
    },
    {
        question: "Preciso criar conta para acessar?",
        answer:
            "Não. Você pode explorar todos os artigos livremente. Em alguns casos, oferecemos recursos adicionais para quem deseja ir além, mas o acesso ao conteúdo principal permanece aberto.",
    },
];

export function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="pb-[120px] border-t border-white/[0.05]">
            <div className="max-w-[1600px] w-full mx-auto">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col w-full max-w-full gap-10"
                >
                    {/* Header */}
                    <div>
                        <motion.p
                            variants={fadeUpVariants}
                            className="text-[11px] mt-6 tracking-[0.25em] uppercase text-white/30 font-sans mb-3"
                        >
                            Perguntas Frequentes
                        </motion.p>

                        <motion.h3
                            variants={fadeUpVariants}
                            className="[font-family:'Playfair_Display',serif] text-[28px] md:text-[36px] leading-[1.2]"
                        >
                            Dúvidas comuns,
                            <br />
                            <em className="not-italic text-white/70">respostas diretas</em>
                        </motion.h3>
                    </div>

                    {/* FAQ List */}
                    <div className="flex flex-col divide-y  divide-white/[0.05]">
                        {FAQ_ITEMS.map((item, index) => {
                            const isOpen = activeIndex === index;

                            return (
                                <motion.div
                                    key={index}
                                    variants={fadeUpVariants}
                                    className="py-6 cursor-pointer group"
                                    onClick={() => toggle(index)}
                                >
                                    {/* Question */}
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="text-white/80 font-sans text-base group-hover:text-white transition">
                                            {item.question}
                                        </span>

                                        <span className="text-white/40 group-hover:text-white transition">
                                            {isOpen ? "−" : "+"}
                                        </span>
                                    </div>

                                    {/* Answer */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="mt-4 text-white/60 font-sans text-sm leading-relaxed max-w-[600px]">
                                                    {item.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}