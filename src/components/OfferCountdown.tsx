// src/components/OfferCountdown.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "./Icons";
import type { Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeLeft {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
}

interface DigitBlockProps {
  value: string;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const OFFER_HEADLINE = "PROMOÇÃO ACABA EM";
const OFFER_COPY     = "30% OFF em todos os ebooks";
const DAYS_AHEAD     = 3; // days from now the offer expires

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTarget(): Date {
  const d = new Date();
  d.setDate(d.getDate() + DAYS_AHEAD);
  d.setHours(23, 59, 59, 999);
  return d;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function fmt(n: number): string {
  return n.toString().padStart(2, "0");
}

function isExpired(t: TimeLeft): boolean {
  return t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0;
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const bannerVariants: Variants = {
  hidden:  { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  exit:    { y: -20, opacity: 0, transition: { duration: 0.35, ease: [0.7, 0, 1, 1] } },
};

const digitVariants: Variants = {
  initial: { y: -14, opacity: 0 },
  animate: { y: 0,   opacity: 1, transition: { duration: 0.2,  ease: "easeOut" } },
  exit:    { y:  14, opacity: 0, transition: { duration: 0.15, ease: "easeIn"  } },
};

// ─── DigitBlock ───────────────────────────────────────────────────────────────

function DigitBlock({ value, label }: DigitBlockProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Number */}
      <div
        className="relative overflow-hidden tabular-nums"
        aria-label={`${value} ${label}`}
        style={{ minWidth: "2ch" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="block font-black text-white leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 7vw, 72px)",
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      {/* Label */}
      <span
        className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/35"
      >
        {label}
      </span>
    </div>
  );
}

// ─── Colon separator ─────────────────────────────────────────────────────────

function Colon() {
  return (
    <motion.span
      animate={{ opacity: [0.15, 0.6, 0.15] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      className="font-black text-white/30 self-start pb-6"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(28px, 5vw, 56px)",
        lineHeight: 1,
        marginTop: "4px",
      }}
      aria-hidden="true"
    >
      :
    </motion.span>
  );
}

// ─── OfferCountdown ───────────────────────────────────────────────────────────

export function OfferCountdown() {
  const targetRef = useRef<Date>(getTarget());
  const [timeLeft,  setTimeLeft]  = useState<TimeLeft>(() => calcTimeLeft(targetRef.current));
  const [dismissed, setDismissed] = useState<boolean>(false);

  const tick = useCallback(() => {
    const next = calcTimeLeft(targetRef.current);
    if (isExpired(next)) {
      const nd = getTarget();
      targetRef.current = nd;
      setTimeLeft(calcTimeLeft(nd));
    } else {
      setTimeLeft(next);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="offer-banner"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="banner"
          aria-label="Promoção por tempo limitado"
          className="fixed top-16 left-0 right-0 z-[90] bg-black border-b border-white/[0.07] flex flex-col items-center justify-center py-6 px-4"
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
          {/* Vertical accent lines */}
          <div aria-hidden="true" className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div aria-hidden="true" className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          {/* Headline */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="font-sans font-black text-white/70 tracking-[0.3em] uppercase mb-4"
            style={{ fontSize: "clamp(9px, 1.5vw, 11px)" }}
          >
            {OFFER_HEADLINE}
          </motion.p>

          {/* Countdown row */}
          <div
            className="flex items-end gap-3 sm:gap-5"
            role="timer"
            aria-label={`${fmt(timeLeft.days)} dias, ${fmt(timeLeft.hours)} horas, ${fmt(timeLeft.minutes)} minutos e ${fmt(timeLeft.seconds)} segundos`}
          >
            <DigitBlock value={fmt(timeLeft.days)}    label="Dias"     />
            <Colon />
            <DigitBlock value={fmt(timeLeft.hours)}   label="Horas"    />
            <Colon />
            <DigitBlock value={fmt(timeLeft.minutes)} label="Minutos"  />
            <Colon />
            <DigitBlock value={fmt(timeLeft.seconds)} label="Segundos" />
          </div>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="font-sans text-[11px] tracking-[0.18em] uppercase text-white/50 mt-4 hidden sm:block"
          >
            {OFFER_COPY}
          </motion.p>

          {/* Dismiss button */}
          <motion.button
            type="button"
            onClick={() => setDismissed(true)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Fechar oferta"
            className="absolute top-3 right-4 sm:right-6 text-white hover:text-white/55 transition-colors duration-200"
          >
            <IconX size={13} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}