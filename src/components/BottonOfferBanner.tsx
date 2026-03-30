// src/components/PersonalizedOfferBanner.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconArrowRight } from "./Icons";
import type { Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeLeft {
  hours:   number;
  minutes: number;
  seconds: number;
}

interface DigitProps {
  value: string;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const OFFER_HEADLINE = "Oferta exclusiva para você";
const OFFER_COPY     = "30% de desconto na sua primeira compra";
const OFFER_CTA      = "Garantir desconto";
const OFFER_HREF     = "/livros";
const HOURS_AHEAD    = 1;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTarget(): Date {
  const d = new Date();
  d.setHours(d.getHours() + HOURS_AHEAD);
  return d;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  return {
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function fmt(n: number): string {
  return n.toString().padStart(2, "0");
}

function isExpired(t: TimeLeft): boolean {
  return t.hours === 0 && t.minutes === 0 && t.seconds === 0;
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const bannerVariants: Variants = {
  hidden:  { y: 80, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { delay: 1.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    y: 80, opacity: 0,
    transition: { duration: 0.4, ease: [0.7, 0, 1, 1] },
  },
};

const digitVariants: Variants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0,   opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit:    { y:  10, opacity: 0, transition: { duration: 0.14, ease: "easeIn"  } },
};

// ─── Digit ────────────────────────────────────────────────────────────────────

function Digit({ value, label }: DigitProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative w-8 h-8 border border-white/[0.12] bg-white/[0.04] flex items-center justify-center overflow-hidden tabular-nums"
        aria-label={`${value} ${label}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute font-mono text-[13px] font-bold text-white leading-none"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-sans text-[8px] tracking-[0.18em] uppercase text-white/30 leading-none">
        {label}
      </span>
    </div>
  );
}

// ─── Separator ───────────────────────────────────────────────────────────────

function Separator() {
  return (
    <motion.span
      animate={{ opacity: [0.15, 0.6, 0.15] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      className="font-mono text-[13px] font-bold text-white/30 mb-4 leading-none self-start mt-1.5"
      aria-hidden="true"
    >
      :
    </motion.span>
  );
}

// ─── LiveDot ─────────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      <motion.span
        animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-white/50"
      />
      <span className="relative rounded-full h-1.5 w-1.5 bg-white/75" />
    </span>
  );
}

// ─── BottonOfferBanner ──────────────────────────────────────────────────────────

export function BottonOfferBanner() {
  const targetRef  = useRef<Date>(getTarget());
  const [timeLeft,  setTimeLeft]  = useState<TimeLeft>(() => calcTimeLeft(targetRef.current));
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  // Tick
  const tick = useCallback(() => {
    const next = calcTimeLeft(targetRef.current);
    setTimeLeft(next);
    if (isExpired(next)) setDismissed(true);
  }, []);

  useEffect(() => {
    const showId     = setTimeout(() => setIsVisible(true), 15000);
    const intervalId = setInterval(tick, 1000);
    return () => {
      clearTimeout(showId);
      clearInterval(intervalId);
    };
  }, [tick]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="offer-banner"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="complementary"
          aria-label="Oferta personalizada por tempo limitado"
          // ── Fixed to bottom-right corner, above footer ──
          className="fixed bottom-6 right-6 z-[100] w-full max-w-[380px] bg-black border border-white/[0.1] shadow-[0_0_40px_rgba(0,0,0,0.8)]"
        >
          {/* Noise */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          {/* Top accent line */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />

          <div className="relative p-6 flex flex-col gap-5">

            {/* ── Header row ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <LiveDot />
                  <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-white/30">
                    Oferta por tempo limitado
                  </span>
                </div>
                <h3
                  className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1] tracking-[-0.01em] text-white"
                  style={{ fontSize: "clamp(17px,2.5vw,21px)" }}
                >
                  {OFFER_HEADLINE}
                </h3>
              </div>

              {/* Dismiss */}
              <motion.button
                type="button"
                onClick={() => setDismissed(true)}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Fechar oferta"
                className="shrink-0 mt-0.5 text-white/25 hover:text-white/60 transition-colors duration-200"
              >
                <IconX size={13} />
              </motion.button>
            </div>

            {/* ── Divider ────────────────────────────────────────────── */}
            <div className="h-px bg-white/[0.07]" />

            {/* ── Copy + countdown row ──────────────────────────────── */}
            <div className="flex items-center justify-between gap-4">
              {/* Copy */}
              <p className="font-sans font-light text-[12px] leading-[1.65] text-white/45 max-w-[170px]">
                {OFFER_COPY}
              </p>

              {/* Countdown */}
              <div
                className="flex items-end gap-1 shrink-0"
                role="timer"
                aria-label={`${fmt(timeLeft.hours)} horas, ${fmt(timeLeft.minutes)} minutos e ${fmt(timeLeft.seconds)} segundos restantes`}
              >
                <Digit value={fmt(timeLeft.hours)}   label="hrs" />
                <Separator />
                <Digit value={fmt(timeLeft.minutes)} label="min" />
                <Separator />
                <Digit value={fmt(timeLeft.seconds)} label="seg" />
              </div>
            </div>

            {/* ── CTA ────────────────────────────────────────────────── */}
            <motion.a
              href={OFFER_HREF}
              onClick={() => setDismissed(true)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-white text-black font-sans text-[11px] font-medium tracking-[0.12em] uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-white/85 transition-colors duration-200"
            >
              {OFFER_CTA}
              <IconArrowRight size={13} />
            </motion.a>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}