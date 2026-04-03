// src/components/MethodCharts.tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BAR_DATA, LINE_POINTS, RADIAL_DATA, MINI_WEEKS } from "../interfaces/MethodData";


// ─── useChartInView helper ────────────────────────────────────────────────────

function useChartInView() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.35 });
  return { ref, inView };
}

// ─── 1. Bar Chart (SVG) ───────────────────────────────────────────────────────

export function BarChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.35 });

  const W = 320;
  const H = 100;
  const DELTA_H = 16;
  const LABEL_H = 16;
  const TOTAL_H = DELTA_H + H + LABEL_H;

  const groups = BAR_DATA.length;
  const groupW = W / groups;
  const barW = (groupW - 10) / 2;
  const barGap = 4;

  return (
    <div className="flex flex-col gap-3 ">
      {/* Legend */}
      <div className="flex items-center gap-4 justify-end">
        {[
          { label: "Antes", fill: "rgba(255,255,255,0.08)", stroke: "rgba(255,255,255,0.2)" },
          { label: "Após E.P.S.D.P", fill: "rgba(0, 188, 125, 1)", stroke: "rgba(0, 188, 125, 1)" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <svg width="12" height="8" aria-hidden="true">
              <rect x="0" y="0" width="12" height="8" fill={l.fill} stroke={l.stroke} strokeWidth="0.8" />
            </svg>
            <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-white/35">{l.label}</span>
          </div>
        ))}
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${TOTAL_H}`}
        className="w-full"
        style={{ height: 130 }}
        aria-label="Gráfico de barras: impacto nos pilares"
      >
        {/* Horizontal grid */}
        {[25, 50, 75, 100].map((pct) => {
          const y = DELTA_H + H - (pct / 100) * H;
          return (
            <g key={pct}>
              <line x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={2} y={y - 2} fill="rgba(255,255,255,0.18)" fontSize="6.5" fontFamily="DM Sans, sans-serif">{pct}</text>
            </g>
          );
        })}

        {/* Bars */}
        {BAR_DATA.map((item, gi) => {
          const hBefore = (item.before / 100) * H;
          const hAfter = (item.after / 100) * H;
          const groupX = gi * groupW + 3;
          const xBefore = groupX;
          const xAfter = groupX + barW + barGap;
          const yBefore = DELTA_H + H - hBefore;
          const yAfter = DELTA_H + H - hAfter;

          return (
            <g key={item.label}>
              <motion.text
                x={xAfter + barW / 2}
                y={yAfter - 6}
                fill="rgba(0, 188, 125, 1)"
                fontSize="10"
                textAnchor="middle"
                fontFamily="DM Sans, sans-serif"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: gi * 0.12 + 0.9, duration: 0.4 }}
              >
                {item.after}%
              </motion.text>

              <motion.rect
                x={xBefore} width={barW}
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="0.5"
                rx={4} // ← controla arredondamento horizontal
                ry={4} // ← controla arredondamento vertical
                initial={{ y: DELTA_H + H, height: 0 }}
                animate={inView ? { y: yBefore, height: hBefore } : { y: DELTA_H + H, height: 0 }}
                transition={{ duration: 0.8, delay: gi * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.rect
                x={xAfter} width={barW}
                fill="rgba(0, 188, 125, 1)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
                rx={4} // ← controla arredondamento horizontal
                ry={4} // ← controla arredondamento vertical
                initial={{ y: DELTA_H + H, height: 0 }}
                animate={inView ? { y: yAfter, height: hAfter } : { y: DELTA_H + H, height: 0 }}
                transition={{ duration: 1, delay: gi * 0.12 + 0.1, ease: [0.16, 1, 0.3, 1] }}
              />

              <text
                x={groupX + barW + barGap / 2}
                y={DELTA_H + H + 13}
                fill="rgba(255,255,255,0.3)"
                fontSize="7"
                textAnchor="middle"
                fontFamily="DM Sans, sans-serif"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        <line x1={0} y1={DELTA_H + H} x2={W} y2={DELTA_H + H} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── PyramidChart (Triade Visual) ─────────────────────────────



export function PyramidChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const W = 200;
  const H = 180;

  return (
    <div className="flex flex-col gap-2 items-center">
      <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/30">
        Estrutura do Método
      </span>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[220px]"
      >
        {/* Glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base */}
        <motion.polygon
          points="20,150 180,150 140,110 60,110"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.25)"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        />

        {/* Meio */}
        <motion.polygon
          points="60,110 140,110 115,75 85,75"
          fill="rgba(255,255,255,0.15)"
          stroke="rgba(255,255,255,0.35)"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        />

        {/* Topo */}
        <motion.polygon
          points="85,75 115,75 100,40"
          fill="rgba(255,255,255,0.6)"
          stroke="rgba(255,255,255,0.6)"
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6 }}
        />

        {/* Labels */}
        <motion.text
          x="185"
          y="160"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          CORPO
        </motion.text>

        <motion.text
          x="160"
          y="100"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          MENTE
        </motion.text>

        <motion.text
          x="140"
          y="60"
          textAnchor="middle"
          fill="white"
          fontSize="9"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          ALMA
        </motion.text>
      </svg>
    </div>
  );
}
// ─── 2. Line Chart (SVG) ─────────────────────────────────────────────────────

export function LineChart() {
  const { ref, inView } = useChartInView();
  const W = 320, H = 80;

  const xs = LINE_POINTS.map((_, i) => (i / (LINE_POINTS.length - 1)) * W);
  const ys = LINE_POINTS.map((v) => H - (v / 100) * H);

  const pathD = LINE_POINTS.map((_, i) =>
    `${i === 0 ? "M" : "L"} ${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`
  ).join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/30">Curva de evolução</span>
        <span className="[font-family:'Playfair_Display',serif] font-bold text-white text-[13px]">+310%</span>
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: 80 }}
        aria-label="Gráfico de linha: curva de evolução"
      >
        <defs>
          <linearGradient id="lg-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0, 188, 125, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 188, 125, 0)" />
          </linearGradient>
          <clipPath id="cp-line">
            <motion.rect
              x="0" y="0" height={H}
              initial={{ width: 0 }}
              animate={inView ? { width: W } : { width: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            />
          </clipPath>
        </defs>

        {[25, 50, 75].map((pct) => (
          <line key={pct}
            x1={0} y1={H - (pct / 100) * H}
            x2={W} y2={H - (pct / 100) * H}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"
          />
        ))}

        <path d={areaD} fill="url(#lg-area)" clipPath="url(#cp-line)" />

        <motion.path
          d={pathD}
          fill="none" stroke="rgba(0, 188, 125, 0.65)" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />

        <motion.circle
          cx={xs[xs.length - 1]} cy={ys[ys.length - 1]}
          r="3" fill="rgba(0, 188, 125, 1)"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 1.4, duration: 0.35 }}
        />
      </svg>

      <div className="flex justify-between mt-1">
        {["Sem 1", "Sem 4", "Sem 8", "Sem 12"].map((l) => (
          <span key={l} className="font-sans text-[8px] tracking-[0.1em] uppercase text-white/20">{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── 3. Radial / Spider mini chart (SVG) ──────────────────────────────────────

export function RadialChart() {
  const { ref, inView } = useChartInView();

  const cx = 80, cy = 80, R = 60;
  const count = RADIAL_DATA.length;

  const axes = RADIAL_DATA.map((_, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    return {
      x: cx + R * Math.cos(angle),
      y: cy + R * Math.sin(angle),
      lx: cx + (R + 14) * Math.cos(angle),
      ly: cy + (R + 14) * Math.sin(angle),
    };
  });

  const ring = (pct: number) => RADIAL_DATA.map((_, i) => {
    const r = R * (pct / 100);
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    return `${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`;
  }).join(" ") + " Z";

  const dataPath = (scale: number) =>
    RADIAL_DATA.map((d, i) => {
      const r = R * (d.value / 100) * scale;
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      return `${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`;
    }).join(" ") + " Z";

  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/30">
        Cobertura multidimensional
      </span>
      <svg
        ref={ref}
        viewBox="0 0 200 160"
        className="w-full"
        style={{ height: 140 }}
        aria-label="Gráfico radar: cobertura multidimensional"
      >
        {[25, 50, 75, 100].map((pct) => (
          <path key={pct} d={ring(pct)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        ))}
        {axes.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        ))}
        <motion.path
          d={dataPath(1)}
          fill="rgba(0, 188, 125, 0.2)"
          stroke="rgba(0, 188, 125, 0.65)"
          strokeWidth="1"
          initial={{ scale: 0, originX: "50%", originY: "50%" }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
        {axes.map((a, i) => (
          <text
            key={i}
            x={a.lx} y={a.ly}
            fill="rgba(255,255,255,0.3)"
            fontSize="7"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="DM Sans, sans-serif"
          >
            {RADIAL_DATA[i].label}
          </text>
        ))}
        {RADIAL_DATA.map((d, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const r = R * (d.value / 100);
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <motion.circle
              key={i} cx={x} cy={y} r="2"
              fill="rgba(0, 188, 125, 1)"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 0.7, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 0.9 + i * 0.07, duration: 0.3 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── 4. Mini sparkline (weekly consistency) ───────────────────────────────────

export function SparklineChart() {
  const { ref, inView } = useChartInView();

  const W = 320, H = 40;
  const xs = MINI_WEEKS.map((_, i) => (i / (MINI_WEEKS.length - 1)) * W);
  const ys = MINI_WEEKS.map((v) => H - (v / 100) * H);

  const pathD = MINI_WEEKS.map((_, i) =>
    `${i === 0 ? "M" : "L"} ${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`
  ).join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="[font-family:'Playfair_Display',serif] font-bold text-white text-[18px] leading-none">93%</span>
        <span className="font-sans text-[8px] tracking-[0.15em] uppercase text-white/30">Consistência</span>
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="flex-1"
        style={{ height: 40 }}
        aria-label="Sparkline: consistência semanal"
      >
        <defs>
          <linearGradient id="lg-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0, 188, 125, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 188, 125, 0)" />
          </linearGradient>
          <clipPath id="cp-spark">
            <motion.rect
              x="0" y="0" height={H}
              initial={{ width: 0 }}
              animate={inView ? { width: W } : { width: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </clipPath>
        </defs>
        <path d={areaD} fill="url(#lg-spark)" clipPath="url(#cp-spark)" />
        <motion.path
          d={pathD}
          fill="none" stroke="rgba(0, 188, 125, 1)" strokeWidth="1.2"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="flex flex-col gap-0.5 items-end shrink-0">
        <div className="flex items-center gap-1">
          <div className="relative flex h-1.5 w-1.5">
            <motion.span
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-white/50"
            />
            <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </div>
          <span className="font-sans text-[8px] tracking-[0.1em] uppercase text-white/30">12 sem</span>
        </div>
      </div>
    </div>
  );
}
