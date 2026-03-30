// src/components/OfferCarousel.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconChevronLeft, IconChevronRight } from "./Icons";
import type { Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeLeft {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
}

interface Slide {
  id:       string;
  type:     "countdown" | "promo";
  headline: string;
  copy:     string;
  badge?:   string;
}

// ─── Slides config ────────────────────────────────────────────────────────────

const DAYS_AHEAD = 3;

const SLIDES: Slide[] = [
  {
    id:       "countdown",
    type:     "countdown",
    headline: "PROMOÇÃO ACABA EM",
    copy:     "30% OFF em todos os ebooks",
    badge:    "TEMPO LIMITADO",
  },
  {
    id:       "bundle",
    type:     "promo",
    headline: "BUNDLE MENTIS DOMINUS",
    copy:     "Adquira 3 ebooks e ganhe o 4º grátis",
    badge:    "NOVA OFERTA",
  },
  {
    id:       "newsletter",
    type:     "promo",
    headline: "ACESSO ANTECIPADO",
    copy:     "Inscreva-se e receba lançamentos com 48h de antecedência",
    badge:    "EXCLUSIVO",
  },
  {
    id:       "membership",
    type:     "promo",
    headline: "PLANO ANUAL",
    copy:     "Acesso ilimitado a toda a plataforma por R$29/mês",
    badge:    "MAIS POPULAR",
  },
];

const AUTOPLAY_INTERVAL = 5000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Motion Variants ──────────────────────────────────────────────────────────

const bannerVariants: Variants = {
  hidden:  { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit:    { y: -20, opacity: 0, transition: { duration: 0.3, ease: [0.7, 0, 1, 1] } },
};

const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25, ease: [0.7, 0, 1, 1] } }),
};

const digitVariants: Variants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit:    { y:  10, opacity: 0, transition: { duration: 0.12, ease: "easeIn"  } },
};

// ─── CountdownUnit ────────────────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <div
        className="relative overflow-hidden tabular-nums"
        style={{ minWidth: "1.8ch" }}
        aria-label={`${value} ${label}`}
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
              fontSize: "clamp(20px, 3.5vw, 28px)",
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="font-sans text-[8px] tracking-[0.2em] uppercase text-white/40 mb-px"
      >
        {label}
      </span>
    </div>
  );
}

function ColonSep() {
  return (
    <motion.span
      animate={{ opacity: [0.15, 0.55, 0.15] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      className="font-black text-white/25 mx-1"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(16px, 2.5vw, 22px)",
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      :
    </motion.span>
  );
}

// ─── SlideContent ─────────────────────────────────────────────────────────────

function SlideContent({ slide, timeLeft }: { slide: Slide; timeLeft: TimeLeft }) {
  if (slide.type === "countdown") {
    return (
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Badge */}
        {slide.badge && (
          <span
            className="hidden sm:inline-block font-sans font-black text-[8px] tracking-[0.25em] uppercase border border-white/20 text-white/50 px-2 py-1 shrink-0"
          >
            {slide.badge}
          </span>
        )}

        {/* Headline */}
        <span
          className="font-sans font-black text-white/60 tracking-[0.25em] uppercase shrink-0"
          style={{ fontSize: "clamp(8px, 1.2vw, 10px)" }}
        >
          {slide.headline}
        </span>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-white/10 shrink-0" />

        {/* Countdown */}
        <div
          className="flex items-center"
          role="timer"
          aria-label={`${fmt(timeLeft.days)} dias, ${fmt(timeLeft.hours)} horas, ${fmt(timeLeft.minutes)} minutos e ${fmt(timeLeft.seconds)} segundos`}
        >
          <CountdownUnit value={fmt(timeLeft.days)}    label="d" />
          <ColonSep />
          <CountdownUnit value={fmt(timeLeft.hours)}   label="h" />
          <ColonSep />
          <CountdownUnit value={fmt(timeLeft.minutes)} label="m" />
          <ColonSep />
          <CountdownUnit value={fmt(timeLeft.seconds)} label="s" />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-white/10 shrink-0" />

        {/* Copy */}
        <span
          className="hidden sm:block font-sans text-[10px] tracking-[0.15em] uppercase text-white/45"
        >
          {slide.copy}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {/* Badge */}
      {slide.badge && (
        <span
          className="hidden sm:inline-block font-sans font-black text-[8px] tracking-[0.25em] uppercase border border-white/20 text-white/50 px-2 py-1 shrink-0"
        >
          {slide.badge}
        </span>
      )}

      {/* Headline */}
      <span
        className="font-sans font-black text-white leading-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(14px, 2.5vw, 20px)",
          letterSpacing: "-0.01em",
        }}
      >
        {slide.headline}
      </span>

      {/* Divider */}
      <div className="hidden sm:block w-px h-5 bg-white/10 shrink-0" />

      {/* Copy */}
      <span
        className="font-sans text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-white/45"
      >
        {slide.copy}
      </span>
    </div>
  );
}

// ─── OfferCarousel ─────────────────────────────────────────────────────────────

export function TopOfferCarousel() {
  const targetRef                   = useRef<Date>(getTarget());
  const [timeLeft,    setTimeLeft]  = useState<TimeLeft>(() => calcTimeLeft(targetRef.current));
  const [dismissed,   setDismissed] = useState(false);
  const [current,     setCurrent]   = useState(0);
  const [direction,   setDirection] = useState(1);
  const [isPaused,    setIsPaused]  = useState(false);
  const autoplayRef                 = useRef<ReturnType<typeof setInterval>>();

  // Tick the countdown
  const tick = useCallback(() => {
    const next = calcTimeLeft(targetRef.current);
    const expired =
      next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0;
    if (expired) {
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

  // Autoplay
  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, -1);
  }, [current, goTo]);

  useEffect(() => {
    if (isPaused || dismissed) return;
    autoplayRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, dismissed, next]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="offer-carousel"
        variants={bannerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="banner"
        aria-label="Promoções Mentis Dominus"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="fixed top-16 left-0 right-0 z-[90] bg-black border-b border-white/[0.07]"
        style={{ height: "5rem" }} // h-20 = 80px
      >
        {/* Noise overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Accent lines */}
        <div aria-hidden="true" className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div aria-hidden="true" className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* Progress bar */}
        {!isPaused && (
          <motion.div
            key={`progress-${current}`}
            className="absolute bottom-0 left-0 h-px bg-white/20"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
          />
        )}

        {/* Layout: prev | content | dots | next | close */}
        <div className="relative h-full flex items-center px-10 sm:px-14">

          {/* Prev button */}
          <motion.button
            type="button"
            onClick={prev}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Slide anterior"
            className="absolute left-3 sm:left-4 text-white/30 hover:text-white/70 transition-colors duration-150"
          >
            <IconChevronLeft size={13} />
          </motion.button>

          {/* Slide content — animated */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex items-center justify-center w-full"
              >
                <SlideContent slide={SLIDES[current]} timeLeft={timeLeft} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {SLIDES.map((s, i) => (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => goTo(i, i > current ? 1 : -1)}
                whileHover={{ scale: 1.4 }}
                aria-label={`Ir para slide ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i === current ? 14 : 4,
                  height:     4,
                  background: i === current ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>

          {/* Next button */}
          <motion.button
            type="button"
            onClick={next}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Próximo slide"
            className="absolute right-8 sm:right-10 text-white/30 hover:text-white/70 transition-colors duration-150"
          >
            <IconChevronRight size={13} />
          </motion.button>

          {/* Dismiss */}
          <motion.button
            type="button"
            onClick={() => setDismissed(true)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Fechar promoções"
            className="absolute right-3 sm:right-4 text-white/25 hover:text-white/55 transition-colors duration-200"
          >
            <IconX size={11} />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}