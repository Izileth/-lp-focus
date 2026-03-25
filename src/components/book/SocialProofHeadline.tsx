// src/components/book/SocialProofHeadline.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { IconStar, IconUsers } from "../Icons";
import type { Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LiveStat {
  viewers:   number;
  purchases: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TICK_MS        = 5_000;
const VIEWERS_MIN    = 8;
const VIEWERS_MAX    = 24;
const PURCHASE_ODDS  = 0.15; // 15% chance per tick

// ─── Motion Variants ──────────────────────────────────────────────────────────

const flipVariants: Variants = {
  enter: { y: -10, opacity: 0 },
  center: { y: 0,   opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
  exit:  { y:  10, opacity: 0, transition: { duration: 0.16, ease: "easeIn"  } },
};

const barVariants: Variants = {
  hidden:  { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ─── LiveNumber ───────────────────────────────────────────────────────────────

function LiveNumber({ value }: { value: number }) {
  return (
    <span className="relative inline-flex tabular-nums" style={{ minWidth: "2ch" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          variants={flipVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="[font-family:'Playfair_Display',serif] font-bold text-white"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── LiveDot ──────────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      <motion.span
        animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-white/50"
      />
      <span className="relative rounded-full h-1.5 w-1.5 bg-white/75" />
    </span>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function VDivider() {
  return (
    <div
      aria-hidden="true"
      className="hidden sm:block h-3 w-px bg-white/[0.1] shrink-0"
    />
  );
}

// ─── SocialProofHeadline ──────────────────────────────────────────────────────

export function SocialProofHeadline() {
  const [stats, setStats] = useState<LiveStat>({ viewers: 12, purchases: 148 });
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const id = setInterval(() => {
      if (!isMounted.current) return;

      setStats((prev) => {
        const delta     = Math.floor(Math.random() * 3) - 1; // -1, 0 or +1
        const viewers   = Math.max(VIEWERS_MIN, Math.min(VIEWERS_MAX, prev.viewers + delta));
        const purchases = Math.random() < PURCHASE_ODDS ? prev.purchases + 1 : prev.purchases;
        return { viewers, purchases };
      });
    }, TICK_MS);

    return () => {
      isMounted.current = false;
      clearInterval(id);
    };
  }, []);

  return (
    <motion.div
      variants={barVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full border-y border-white/[0.06] overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Estatísticas ao vivo"
    >
      {/* Subtle noise */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-8 md:px-16 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">

        {/* ── Viewers ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <LiveDot />
          <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-white/35 flex items-center gap-1">
            <LiveNumber value={stats.viewers} />
            <span>pessoas vendo agora</span>
          </p>
        </div>

        <VDivider />

        {/* ── Purchases ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <span className="text-white/30 shrink-0">
            <IconStar size={11} />
          </span>
          <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-white/35 flex items-center gap-1">
            <span>Mais de</span>
            <LiveNumber value={stats.purchases} />
            <span>cópias nas últimas 24h</span>
          </p>
        </div>

        <VDivider />

        {/* ── Static trust ─────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2.5">
          <span className="text-white/30 shrink-0">
            <IconUsers size={13} />
          </span>
          <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-white/35">
            +3.000 leitores satisfeitos
          </p>
        </div>

      </div>
    </motion.div>
  );
}