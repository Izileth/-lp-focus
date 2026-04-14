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
        <section className="w-full py-10 px-10 sm:px-10 md:px-8 pb-20 md:pb-28 border-t border-white/[0.05]">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col gap-12"
                >
                    {/* Header */}
                    <div className="max-w-2xl">
                        <motion.p
                            variants={fadeUpVariants}
                            className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white/30 mb-3"
                        >
                            Perguntas Frequentes
                        </motion.p>

                        <motion.h3
                            variants={fadeUpVariants}
                            className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight"
                        >
                            Dúvidas comuns,
                            <br />
                            <span className="text-white/70">
                                respostas diretas
                            </span>
                        </motion.h3>
                    </div>

                    {/* FAQ */}
                    <div className="flex flex-col divide-y divide-white/[0.05]">
                        {FAQ_ITEMS.map((item, index) => {
                            const isOpen = activeIndex === index;

                            return (
                                <motion.div
                                    key={index}
                                    variants={fadeUpVariants}
                                    className="py-5 sm:py-6 group"
                                >
                                    <button
                                        onClick={() => toggle(index)}
                                        className="w-full flex items-center justify-between gap-4 text-left"
                                    >
                                        {/* Question */}
                                        <span className="text-white/80 text-sm sm:text-base md:text-lg transition group-hover:text-white">
                                            {item.question}
                                        </span>

                                        {/* Icon animado */}
                                        <motion.span
                                            animate={{ rotate: isOpen ? 45 : 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-white/40 group-hover:text-white text-xl"
                                        >
                                            +
                                        </motion.span>
                                    </button>

                                    {/* Answer */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{
                                                    duration: 0.35,
                                                    ease: [0.4, 0, 0.2, 1],
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed max-w-2xl">
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