// src/components/EPSDPSection.tsx
import { motion } from "framer-motion";
import { IconZap, IconTrendingUp, IconCheckCircle, IconArrowRight } from "./Icons";
import { fadeUpVariants, staggerContainer } from "../motionVariants";

// ─── Chart Component ──────────────────────────────────────────────────────────

function EPSDPChart() {
  const DATA = [
    { label: "Foco", before: 30, after: 95 },
    { label: "Clareza", before: 45, after: 90 },
    { label: "Execução", before: 20, after: 85 },
    { label: "Retenção", before: 40, after: 92 },
  ];

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-sm">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-1">Impacto nos Pilares</span>
          <h4 className="text-xl font-serif italic text-white">Mensuração de Performance</h4>
        </div>
        <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">+310%</div>
      </div>

      <div className="flex flex-col gap-8">
        {DATA.map((item, i) => (
          <div key={item.label} className="flex flex-col gap-2">
            <div className="flex justify-between text-[11px] uppercase tracking-wider">
              <span className="text-white/60">{item.label}</span>
              <span className="text-emerald-400 font-bold">{item.after}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.before}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="absolute inset-y-0 left-0 bg-white/20 z-10"
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.after}%` }}
                transition={{ duration: 1.2, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="absolute inset-y-0 left-0 bg-emerald-500/80"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-6 text-[10px] uppercase tracking-widest text-white/40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white/20" /> Antes do Método
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500" /> Após E.P.S.D.P
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EPSDPSection() {
  const PILARES = [
    { 
      letter: "E", 
      title: "Estratégia", 
      desc: "Alinhamento de objetivos com recursos cognitivos.",
      icon: <IconZap size={20} className="text-white/60" />
    },
    { 
      letter: "P", 
      title: "Performance", 
      desc: "Otimização de rotinas para estados de flow constante.",
      icon: <IconTrendingUp size={20} className="text-white/60" />
    },
    { 
      letter: "S", 
      title: "Sistemas", 
      desc: "Arquiteturas de suporte que automatizam a atenção.",
      icon: <IconCheckCircle size={20} className="text-white/60" />
    },
    { 
      letter: "D", 
      title: "Dados", 
      desc: "Feedback loops baseados em neurociência aplicada.",
      icon: <IconArrowRight size={20} className="text-white/60" />
    },
    { 
      letter: "P", 
      title: "Processos", 
      desc: "Iteração contínua para resultados de longo prazo.",
      icon: <IconZap size={20} className="text-white/60" />
    }
  ];

  return (
    <section className="py-24 border-t border-white/5 bg-black" id="metodo">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1200px] mx-auto px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="flex flex-col gap-10">
            <motion.div variants={fadeUpVariants} className="flex flex-col gap-4">
              <span className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-bold">A Metodologia</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                O Método <em className="italic text-white/40 not-italic font-serif">E.P.S.D.P</em>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed max-w-xl">
                Não é sobre trabalhar mais, é sobre arquitetar sua mente para operar em frequências superiores de clareza e execução.
              </p>
            </motion.div>

            <div className="flex flex-col gap-6">
              {PILARES.map((p, i) => (
                <motion.div
                  key={i}
                  variants={fadeUpVariants}
                  className="flex items-start gap-6 group"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-white/10 bg-white/[0.02] text-xl font-serif font-bold group-hover:bg-white/10 transition-colors">
                    {p.letter}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[13px] uppercase tracking-widest font-bold text-white/90">{p.title}</h4>
                    <p className="text-[13px] text-white/40 leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div variants={fadeUpVariants} className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-20 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative flex flex-col gap-8">
              <EPSDPChart />
              
              <div className="bg-white/[0.02] border border-white/5 p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-black">
                  <span className="text-2xl font-serif italic text-white/40">VS</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Comparação Pragmática</h4>
                  <p className="text-[11px] text-white/30 leading-relaxed">
                    A maioria foca apenas no "P" de Performance. O método E.P.S.D.P cria a estrutura que sustenta a performance no longo prazo.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
