// src/components/MethodSection.tsx
import { motion } from "framer-motion";

import {
  IconZap, IconTrendingUp, IconCheckCircle,
  IconArrowRight, IconSettings, IconAward, IconClock,
} from "./Icons";

import { PILARES, TRIADE, RADIAL_DATA } from "../interfaces/MethodData";
import { BarChart, LineChart, RadialChart, SparklineChart, PyramidChart } from "./MethodCharts";
import { fadeUpVariants as fadeUp, staggerContainer as stagger } from "../motionVariants";

// ─── Sub-Components ───────────────────────────────────────────────────────────

function SectionHeader({ subtitle, title, desc }: { subtitle: string, title: React.ReactNode, desc: string }) {
  return (
    <motion.div variants={fadeUp} className="mb-16 md:mb-20">
      <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-white/30 border-l-2 border-white/20 pl-3 mb-4 block">
        {subtitle}
      </span>
      <h2 className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(32px,5vw,60px)" }}>
        {title}
      </h2>
      <p className="font-sans font-light text-white/45 leading-[1.75] mt-4 max-w-[520px]" style={{ fontSize: "clamp(14px,1.2vw,16px)" }}>
        {desc}
      </p>
    </motion.div>
  );
}

function PilarItem({ p, index }: { p: typeof PILARES[0], index: number }) {
  const icons = [
    <IconZap size={14} />,
    <IconTrendingUp size={14} />,
    <IconSettings size={14} />,
    <IconCheckCircle size={14} />,
    <IconArrowRight size={14} />,
  ];

  return (
    <motion.div variants={fadeUp} className="flex items-start gap-5 group">
      <div className="w-10 h-10 shrink-0 border border-white/[0.1] bg-white/[0.02] flex items-center justify-center group-hover:border-white/25 group-hover:bg-white/[0.05] transition-[border-color,background] duration-300">
        <span className="[font-family:'Playfair_Display',serif] font-bold text-white/70 group-hover:text-white transition-colors" style={{ fontSize: 16 }}>
          {p.letter}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 pt-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-white/25">{icons[index]}</span>
          <h4 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-white/70">{p.title}</h4>
        </div>
        <p className="font-sans font-light text-[13px] leading-[1.65] text-white/40">{p.desc}</p>
      </div>
    </motion.div>
  );
}

function TriadeItem({ t, index }: { t: typeof TRIADE[0], index: number }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-7 h-7 shrink-0 border border-white/[0.1] flex items-center justify-center">
        <span className="[font-family:'Playfair_Display',serif] font-bold text-white/40 group-hover:text-white/70 transition-colors" style={{ fontSize: 11 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 pt-0.5">
        <h5 className="font-sans text-[11px] font-medium tracking-[0.18em] uppercase text-white/65">{t.label}</h5>
        <p className="font-sans font-light text-[12px] leading-[1.65] text-white/35">{t.desc}</p>
      </div>
    </div>
  );
}

function StatsCard({ title, subtitle, badge, children, className = "" }: { title: string, subtitle: string, badge?: React.ReactNode, children: React.ReactNode, className?: string }) {
  return (
    <div className={`border rounded-2xl border-white/[0.08] bg-white/[0.02] p-6 flex flex-col gap-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">{subtitle}</span>
          <h4 className="[font-family:'Playfair_Display',serif] font-bold text-white leading-tight" style={{ fontSize: "clamp(15px,2vw,19px)" }}>
            {title}
          </h4>
        </div>
        {badge && (
          <span className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-emerald-500 border border-esmerald-500/[0.12] px-2.5 py-1 shrink-0 flex items-center gap-1.5">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Main Section Components ───────────────────────────────────────────────────

export function MethodEPSDPSection() {
  return (
    <section id="metodo" className="relative border-t  border-white/[0.06] py-24 md:py-32 overflow-hidden bg-black">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />
      
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.06 }}
        className="max-w-[1300px] mx-auto px-8 md:px-14"
      >
        <SectionHeader 
          subtitle="A Metodologia"
          title={<>O Método <em className="not-italic text-white/45">E.P.S.D.P</em></>}
          desc="Não é sobre trabalhar mais — é sobre arquitetar sua mente para operar em frequências superiores de clareza e execução."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="flex flex-col gap-8">
            {PILARES.map((p, i) => (
              <PilarItem key={i} p={p} index={i} />
            ))}
          </div>

          <motion.div variants={fadeUp}>
            <StatsCard title="Mensuração de performance" subtitle="Impacto nos pilares" badge="+310%">
              <div className="flex flex-col gap-7">
                <BarChart />
                <div className="h-px   bg-white/[0.06]" />
                <LineChart />
              </div>
            </StatsCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export function MethodDiagnosisSection() {
  return (
    <section id="diagnostico" className="relative border-t border-white/[0.06] py-24 md:py-32 overflow-hidden bg-[#050505]">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.06 }}
        className="max-w-[1300px] mx-auto px-8 md:px-14"
      >
        <SectionHeader 
          subtitle="Análise Sistêmica"
          title={<>Visão <em className="not-italic text-white/45">Multidimensional</em></>}
          desc="Avaliamos cada faceta da sua rotina para identificar os gargalos invisíveis que impedem sua evolução máxima."
        />

        <motion.div variants={fadeUp}>
          <StatsCard title="Diagnóstico de Ativo" subtitle="Mapeamento de competências" badge={<><IconClock size={11} /> 12 sem</>} className="max-w-[800px] mx-auto">
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <RadialChart />
                <div className="flex flex-col gap-4">
                  {RADIAL_DATA.map((d) => (
                    <div key={d.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-white/40">{d.label}</span>
                        <span className="font-sans text-[11px] font-medium text-white/70">{d.value}%</span>
                      </div>
                      <div className="h-px bg-white/[0.08] relative overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-emerald-500/50"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${d.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex flex-col gap-2">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/20 mb-2">Progressão de Clareza Operacional</span>
                <SparklineChart />
              </div>
            </div>
          </StatsCard>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function MethodTriadeSection() {
  return (
    <section id="triade" className="relative border-t border-white/[0.06] py-24 md:py-32 overflow-hidden bg-black">
      <div aria-hidden="true" className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
      
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.06 }}
        className="max-w-[1300px] mx-auto px-8 md:px-14"
      >
        <SectionHeader 
          subtitle="A Trindade da Alta Performance"
          title={<>Alma · Corpo · <em className="not-italic text-white/45">Mente</em></>}
          desc="O equilíbrio absoluto entre estas três forças é o que separa os amadores dos realizadores de elite."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div variants={fadeUp} className="order-2 lg:order-1">
            <StatsCard title="Engenharia do Desempenho" subtitle="Tríade fundamental">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-5">
                  {TRIADE.map((t, i) => (
                    <TriadeItem key={i} t={t} index={i} />
                  ))}
                </div>
                <div className="mt-4 border-t border-white/[0.06] pt-6 flex items-start gap-4">
                  <span className="text-white/20 shrink-0 mt-0.5"><IconAward size={18} /></span>
                  <p className="font-sans text-[12px] leading-[1.7] text-white/35 italic">
                    "A maioria foca apenas na Performance. A Tríade cria a estrutura inabalável que sustenta o sucesso no longo prazo, sem burnout ou estagnação."
                  </p>
                </div>
              </div>
            </StatsCard>
          </motion.div>

          <motion.div variants={fadeUp} className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[400px]">
              <PyramidChart />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
