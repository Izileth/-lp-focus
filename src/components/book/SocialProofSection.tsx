// src/components/book/SocialProofSection.tsx
import { motion } from "framer-motion";
import { IconStar, IconQuote, IconArrowUpRight, IconTrendingUp } from "../Icons";
import { fadeUpVariants, staggerContainer } from "../../motionVariants";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

// ─── Dados Mock (Persuasivos) ──────────────────────────────────────────────────

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Marcelo Arantes",
    role: "Neurocientista & Pesquisador",
    content: "A profundidade com que os conceitos são abordados é raramente vista em obras contemporâneas. Uma ferramenta essencial para quem busca alta performance cognitiva.",
    rating: 5
  },
  {
    id: 2,
    name: "Beatriz Cavalcante",
    role: "Diretora de Operações @ TechFlow",
    content: "Implementei as técnicas de foco profundo em minha equipe e os resultados em termos de entregas qualitativas foram visíveis em menos de duas semanas.",
    rating: 5
  },
  {
    id: 3,
    name: "Ricardo Mendes",
    role: "Empreendedor Serial",
    content: "Este livro não é apenas sobre produtividade, é sobre clareza mental em um mundo saturado de ruído. Mudou minha forma de encarar o trabalho.",
    rating: 5
  }
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <IconStar key={i} size={10} className="text-white/80" />
      ))}
    </div>
  );
}

function ImpactChart() {
  return (
    <div className="bg-white/[0.02] border border-white/[0.08] p-8 rounded-sm">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1">Impacto Mensurável</span>
          <h4 className="text-xl font-serif font-bold italic text-white/90">Curva de Retenção & Foco</h4>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <IconTrendingUp size={12} className="text-emerald-400" />
          <span className="text-[10px] font-sans font-bold text-emerald-400 uppercase tracking-wider">+87%</span>
        </div>
      </div>

      {/* Gráfico Visual Simples com Framer Motion */}
      <div className="relative h-48 flex items-end gap-2 sm:gap-4 pt-10">
        {[40, 65, 55, 85, 75, 95].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="w-full bg-gradient-to-t from-white/[0.02] to-white/[0.15] border-t border-white/20 relative group"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-sans text-white/40">{height}%</span>
              </div>
            </motion.div>
            <span className="text-[9px] font-sans text-white/20 uppercase tracking-tighter">Sem {i + 1}</span>
          </div>
        ))}
        
        {/* Linha de Base */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
      </div>

      <p className="mt-8 font-sans text-[11px] text-white/30 leading-relaxed text-center">
        Dados baseados no acompanhamento de 1.200 leitores durante os primeiros 45 dias de aplicação do método.
      </p>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export function SocialProofSection() {
  return (
    <section className="py-24 border-t border-white/5">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-24"
      >
        
        {/* Seção 1: Depoimentos em Grade */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              variants={fadeUpVariants}
              className="relative flex flex-col gap-6 p-8 bg-white/[0.01] border border-white/[0.05] hover:border-white/[0.12] transition-colors group"
            >
              <div className="absolute -top-3 -left-3 text-white/5 group-hover:text-white/10 transition-colors">
                <IconQuote size={40} />
              </div>
              
              <div className="flex flex-col gap-4">
                <StarRating count={t.rating} />
                <p className="font-serif text-[17px] leading-[1.6] text-white/70 italic">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-sans font-bold text-white/40 uppercase">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h5 className="font-sans text-[12px] font-bold text-white/90 uppercase tracking-wider">{t.name}</h5>
                  <p className="font-sans text-[10px] text-white/30 uppercase tracking-[0.1em]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Seção 2: Relato Detalhado & Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div variants={fadeUpVariants} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-white/30">Relato de Transformação</span>
              <h3 className="text-3xl md:text-5xl font-serif font-bold leading-[1.2]">
                De <em className="text-white/40 not-italic">Burnout</em> à Maestria do <em className="text-white/40 not-italic">Foco</em>.
              </h3>
            </div>
            
            <div className="flex flex-col gap-6">
              <p className="font-sans text-base text-white/50 leading-[1.8]">
                "Eu costumava acreditar que ser produtivo significava estar ocupado 12 horas por dia. O resultado foi uma estafa mental severa e zero progresso real nos meus projetos."
              </p>
              <p className="font-sans text-base text-white/50 leading-[1.8]">
                "Após aplicar os fundamentos de <strong>Deep Work</strong> descritos na obra, minha percepção mudou. Reduzi meu tempo de trabalho pela metade, enquanto dobrei minha produção criativa. Não é mágica, é neurociência aplicada à rotina."
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-white">André Valadão</span>
                <span className="text-[10px] font-sans text-white/20 uppercase tracking-[0.2em]">Escritor & Estrategista Digital</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <button className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors group">
                Ler Estudo Completo <IconArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariants}>
            <ImpactChart />
          </motion.div>

        </div>

      </motion.div>
    </section>
  );
}
