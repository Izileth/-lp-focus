// src/components/OfferCountdown.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconClock, IconX, IconArrowRight } from "./Icons";
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

const OFFER_LABEL  = "Oferta por tempo limitado";
const OFFER_COPY   = "30% OFF em todos os ebooks";
const OFFER_CTA    = "Aproveitar";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getEndOfDay(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
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
  hidden:  { y: -40, opacity: 0 },
  visible: { y: 0,   opacity: 1, transition: { delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  exit:    { y: -40, opacity: 0,             transition: { duration: 0.4, ease: [0.7, 0, 1, 1] } },
};

const digitVariants: Variants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0,   opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit:    { y:  10, opacity: 0, transition: { duration: 0.14, ease: "easeIn"  } },
};

// ─── Digit cell ──────────────────────────────────────────────────────────────

function Digit({ value, label }: DigitProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="relative w-7 h-7 border border-black/[0.12] bg-black/[0.04] flex items-center justify-center overflow-hidden tabular-nums"
        aria-label={`${value} ${label}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            variants={digitVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute font-mono text-[13px] font-bold text-black leading-none"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-sans text-[8px] tracking-[0.18em] uppercase text-black/35 leading-none hidden sm:block">
        {label}
      </span>
    </div>
  );
}

// ─── Separator ───────────────────────────────────────────────────────────────

function Separator() {
  return (
    <motion.span
      animate={{ opacity: [0.2, 0.7, 0.2] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      className="font-mono text-[13px] font-bold text-black/35 mb-3 leading-none self-start mt-1.5"
      aria-hidden="true"
    >
      :
    </motion.span>
  );
}

// ─── Live dot ────────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      <motion.span
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-black/50"
      />
      <span className="relative rounded-full h-1.5 w-1.5 bg-black/70" />
    </span>
  );
}

// ─── OfferCountdown ───────────────────────────────────────────────────────────

export function OfferCountdown() {
  const targetRef = useRef<Date>(getEndOfDay());

  const [timeLeft,   setTimeLeft]   = useState<TimeLeft>(() => calcTimeLeft(targetRef.current));
  const [dismissed,  setDismissed]  = useState<boolean>(false);

  // Tick every second
  const tick = useCallback(() => {
    const next = calcTimeLeft(targetRef.current);

    // Roll over to next day on expire
    if (isExpired(next)) {
      const nextDay = new Date(targetRef.current.getTime() + 24 * 60 * 60 * 1000);
      nextDay.setHours(23, 59, 59, 999);
      targetRef.current = nextDay;
      setTimeLeft(calcTimeLeft(nextDay));
    } else {
      setTimeLeft(next);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  // ─────────────────────────────────────────────────────────────────────────

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
          aria-label="Oferta por tempo limitado"
          className="fixed top-16 left-0 right-0 z-[90] h-11 bg-white border-b border-black/[0.08] flex items-center"
        >
          {/* Subtle noise */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Left accent line */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black/15 to-transparent"
          />
          {/* Right accent line */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black/15 to-transparent"
          />

          <div className="flex items-center justify-center gap-4 sm:gap-6 max-w-[1200px] w-full mx-auto px-4 sm:px-10">

            {/* Live indicator + label */}
            <div className="hidden sm:flex items-center gap-2.5">
              <LiveDot />
              <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-black/45">
                {OFFER_LABEL}
              </span>
            </div>

            {/* Mobile: clock icon */}
            <span className="sm:hidden text-black/40">
              <IconClock size={13} />
            </span>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="hidden sm:block h-4 w-px bg-black/[0.1]"
            />

            {/* Countdown */}
            <div
              className="flex items-end gap-1"
              aria-label={`Tempo restante: ${fmt(timeLeft.hours)} horas, ${fmt(timeLeft.minutes)} minutos e ${fmt(timeLeft.seconds)} segundos`}
              role="timer"
            >
              <Digit value={fmt(timeLeft.hours)}   label="hrs" />
              <Separator />
              <Digit value={fmt(timeLeft.minutes)} label="min" />
              <Separator />
              <Digit value={fmt(timeLeft.seconds)} label="seg" />
            </div>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="hidden md:block h-4 w-px bg-black/[0.1]"
            />

            {/* Offer copy */}
            <div className="hidden md:flex items-center gap-2.5">
              <span
                className="[font-family:'Playfair_Display',serif] font-bold text-black text-[13px] tracking-wide"
              >
                {OFFER_COPY}
              </span>
              <a
                href="#livros"
                className="group flex items-center gap-1 font-sans text-[10px] tracking-[0.15em] uppercase text-black/45 hover:text-black transition-colors duration-200"
              >
                {OFFER_CTA}
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  <IconArrowRight size={11} />
                </span>
              </a>
            </div>

          </div>

          {/* Dismiss */}
          <motion.button
            type="button"
            onClick={() => setDismissed(true)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Fechar banner de oferta"
            className="absolute right-4 sm:right-6 text-black/30 hover:text-black/70 transition-colors duration-200"
          >
            <IconX size={13} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}