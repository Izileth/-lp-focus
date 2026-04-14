// src/components/SocialProofCarousel.tsx
import { motion } from "framer-motion";
import { IconStar, IconQuote, IconVerified } from "./Icons";
import {  staggerContainer } from "../motionVariants";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Marcelo Arantes",
    role: "Neurocientista",
    content: "A profundidade com que os conceitos são abordados é raramente vista em obras contemporâneas.",
    rating: 5
  },
  {
    id: 2,
    name: "Beatriz Cavalcante",
    role: "Diretora de Operações",
    content: "Implementei as técnicas de foco profundo em minha equipe e os resultados foram visíveis em menos de duas semanas.",
    rating: 5
  },
  {
    id: 3,
    name: "Ricardo Mendes",
    role: "Empreendedor",
    content: "Este livro não é apenas sobre produtividade, é sobre clareza mental em um mundo saturado de ruído.",
    rating: 5
  },
  {
    id: 4,
    name: "Juliana Silva",
    role: "Product Manager",
    content: "O método transformou minha maneira de organizar o dia. Menos estresse, mais resultado real.",
    rating: 5
  },
  {
    id: 5,
    name: "Thiago Oliveira",
    role: "Engenheiro de Software",
    content: "Foco inabalável. É exatamente o que eu precisava para meus projetos paralelos.",
    rating: 5
  }
];

export function SocialProofCarousel() {
  return (
    <section className="py-20 overflow-hidden bg-black">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-[1400px] mx-auto px-8"
      >


        {/* Carousel Container */}
        <div className="relative  ">
          <div className="flex gap-6 animate-scroll">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="min-w-[320px] md:min-w-[400px] p-8 bg-black border border-white/5 rounded-2xl flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <IconStar key={i} size={10} className="text-amber-500" />
                  ))}
                </div>
                
                <div className="relative">
                  <IconQuote size={24} className="absolute -top-2 -left-2 text-white/5" />
                  <p className="font-serif italic text-white/70 leading-relaxed relative z-10">
                    "{t.content}"
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 uppercase">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="text-[12px]  py-0 my-0 font-bold text-white/90 uppercase tracking-wider flex items-center">
                      {t.name} <IconVerified className="mb-1 ml-1" size={14} />
                    </h5>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.1em]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-400px * 5 - 1.5rem * 5)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
