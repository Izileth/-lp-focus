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

function PilarItem({ p, index }: { p: typeof PILARES[0], index: number }) {
  // Map icons here to keep data file clean of JSX if possible, 
  // but here we just use the index to match the original icons.
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

function StatsCard({ title, subtitle, badge, children }: { title: string, subtitle: string, badge?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">{subtitle}</span>
          <h4 className="[font-family:'Playfair_Display',serif] font-bold text-white leading-tight" style={{ fontSize: "clamp(15px,2vw,19px)" }}>
            {title}
          </h4>
        </div>
        {badge && (
          <span className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-white/35 border border-white/[0.12] px-2.5 py-1 shrink-0 flex items-center gap-1.5">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Main Section Component ───────────────────────────────────────────────────

export function EPSDPSection() {
  return (
    <section id="metodo" className="relative border-t border-white/[0.06] py-24 md:py-32 overflow-hidden bg-black">
      {/* Visual Effects */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent pointer-events-none" />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.06 }}
        className="max-w-[1200px] mx-auto px-8 md:px-16"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-16 md:mb-20">
          <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-white/30 border-l-2 border-white/20 pl-3 mb-4 block">
            A Metodologia
          </span>
          <h2 className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(32px,5vw,60px)" }}>
            O Método <em className="not-italic text-white/45">E.P.S.D.P</em>
          </h2>
          <p className="font-sans font-light text-white/45 leading-[1.75] mt-4 max-w-[520px]" style={{ fontSize: "clamp(14px,1.2vw,16px)" }}>
            Não é sobre trabalhar mais — é sobre arquitetar sua mente para operar em frequências superiores de clareza e execução.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: Pilares */}
          <div className="flex flex-col gap-8">
            {PILARES.map((p, i) => (
              <PilarItem key={i} p={p} index={i} />
            ))}
          </div>

          {/* Right Column: Analytics & Strategy */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            {/* Analytics Card */}
            <StatsCard title="Mensuração de performance" subtitle="Impacto nos pilares" badge="+310%">
              <div className="flex flex-col gap-7">
                <BarChart />
                <div className="h-px bg-white/[0.06]" />
                <LineChart />
              </div>
            </StatsCard>

            {/* Multidimensional Diagnosis Card */}
            <StatsCard title="Visão multidimensional" subtitle="Diagnóstico completo" badge={<><IconClock size={11} /> 12 sem</>}>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6 items-start">
                  <RadialChart />
                  <div className="flex flex-col gap-3 pt-4">
                    {RADIAL_DATA.map((d) => (
                      <div key={d.label} className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="font-sans text-[9px] tracking-[0.12em] uppercase text-white/35">{d.label}</span>
                          <span className="font-sans text-[9px] font-medium text-white/55">{d.value}%</span>
                        </div>
                        <div className="h-px bg-white/[0.06] relative overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-white/40"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${d.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-white/[0.06]" />
                <SparklineChart />
              </div>
            </StatsCard>

            {/* Strategy Card */}
            <StatsCard title="Mente · Método · Momentum" subtitle="Tríade do alto desempenho">
              <div className="flex flex-col gap-5">
                <div className="h-px bg-white/[0.06]" />
                <div className="flex flex-col gap-4">
                  {TRIADE.map((t, i) => (
                    <TriadeItem key={i} t={t} index={i} />
                  ))}
                </div>
                <PyramidChart/>
                <div className="mt-1 border-t border-white/[0.06] pt-4 flex items-start gap-3">
                  <span className="text-white/20 shrink-0 mt-0.5"><IconAward size={14} /></span>
                  <p className="font-sans text-[11px] leading-[1.6] text-white/30 italic">
                    A maioria foca apenas no "P" de Performance. O método E.P.S.D.P e a Tríade criam a estrutura que sustenta a performance no longo prazo.
                  </p>
                </div>
              </div>
            </StatsCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
