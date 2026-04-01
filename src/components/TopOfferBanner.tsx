// src/components/OfferCarousel.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconChevronLeft, IconChevronRight } from "./Icons";
import type { Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeLeft {
  days: number;
  hours: number;
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

// ─── Config ───────────────────────────────────────────────────────────────────

const DAYS_AHEAD = 3;
const AUTOPLAY_INTERVAL = 5000;
const SCROLL_THRESHOLD = 10; // px antes de ativar o fundo

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
    copy:     "Inscreva-se com 48h de antecedência",
    badge:    "EXCLUSIVO",
  },
  {
    id:       "membership",
    type:     "promo",
    headline: "PLANO ANUAL",
    copy:     "Acesso ilimitado por R$29/mês",
    badge:    "MAIS POPULAR",
  },
];

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

function fmt(n: number) {
  return n.toString().padStart(2, "0");
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const slideVariants: Variants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:   (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.7, 0, 1, 1] },
  }),
};

const digitVariants: Variants = {
  initial: { y: -8, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit:    { y:  8, opacity: 0, transition: { duration: 0.1,  ease: "easeIn"  } },
};

// ─── CountdownUnit ────────────────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <div
        className="relative overflow-hidden tabular-nums"
        style={{ minWidth: "1.6ch" }}
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
              fontSize: "clamp(18px, 3vw, 24px)",
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[7px] tracking-[0.18em] uppercase text-white/30">
        {label}
      </span>
    </div>
  );
}

function ColonSep() {
  return (
    <motion.span
      animate={{ opacity: [0.1, 0.4, 0.1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      className="text-white/20 mx-1 font-black"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(14px, 2vw, 20px)",
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
  const badge = slide.badge && (
    <span className="hidden sm:inline-block text-[8px] font-black tracking-[0.22em] uppercase border border-white/10 text-white/35 px-2 py-[3px]">
      {slide.badge}
    </span>
  );

  const sep = <div className="hidden sm:block w-px h-4 bg-white/8 shrink-0" />;

  if (slide.type === "countdown") {
    return (
      <div className="flex items-center gap-4 sm:gap-5">
        {badge}
        <span
          className="font-black text-white/50 tracking-[0.22em] uppercase shrink-0"
          style={{ fontSize: "clamp(7px, 1vw, 9px)" }}
        >
          {slide.headline}
        </span>
        {sep}
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
        {sep}
        <span className="hidden sm:block text-[10px] tracking-[0.14em] uppercase text-white/35">
          {slide.copy}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 sm:gap-5">
      {badge}
      <span
        className="font-black text-white/85 leading-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(13px, 2.2vw, 18px)",
          letterSpacing: "-0.01em",
        }}
      >
        {slide.headline}
      </span>
      {sep}
      <span className="text-[10px] tracking-[0.14em] uppercase text-white/35">
        {slide.copy}
      </span>
    </div>
  );
}

// ─── OfferCarousel ────────────────────────────────────────────────────────────

export function TopOfferCarousel() {
  const targetRef                  = useRef<Date>(getTarget());
  const autoplayRef                = useRef<ReturnType<typeof setInterval> | null>(null);

  const [timeLeft,  setTimeLeft]   = useState<TimeLeft>(() => calcTimeLeft(getTarget()));
  const [dismissed, setDismissed]  = useState(false);
  const [current,   setCurrent]    = useState(0);
  const [direction, setDirection]  = useState(1);
  const [isPaused,  setIsPaused]   = useState(false);

  // ── Nova: detecta scroll para ativar o fundo ─────────────────────────────
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const next = calcTimeLeft(targetRef.current);
      const expired = Object.values(next).every((v) => v === 0);
      if (expired) {
        targetRef.current = getTarget();
        setTimeLeft(calcTimeLeft(targetRef.current));
      } else {
        setTimeLeft(next);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Navegação ─────────────────────────────────────────────────────────────
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

  // ── Autoplay ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || dismissed) return;
    autoplayRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isPaused, dismissed, next]);

  if (dismissed) return null;

  return (
    <div
      role="banner"
      aria-label="Promoções Mentis Dominus"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-0 left-0 right-0 z-[90] h-12"
      style={{
        // Transparente no topo → escuro ao rolar
        background:   scrolled ? "rgba(8, 8, 8, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      {/* Progress bar */}
      {!isPaused && (
        <motion.div
          key={`prog-${current}`}
          className="absolute bottom-0 left-0 h-px bg-white/15"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
        />
      )}

      {/* Layout */}
      <div className="relative h-full flex items-center px-8 sm:px-12">

        {/* Prev */}
        <motion.button
          type="button"
          onClick={prev}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Slide anterior"
          className="absolute left-3 text-white/25 hover:text-white/60 transition-colors"
        >
          <IconChevronLeft size={12} />
        </motion.button>

        {/* Slide */}
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
        <div className="absolute bottom-[22px] left-20 -translate-x-1/2 flex items-center gap-[5px]">
          {SLIDES.map((s, i) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => goTo(i, i > current ? 1 : -1)}
              whileHover={{ scale: 1.4 }}
              aria-label={`Ir para slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              className="rounded-full  transition-all duration-300"
              style={{
                width:      i === current ? 14 : 4,
                height:     3,
                background: i === current
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <motion.button
          type="button"
          onClick={next}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Próximo slide"
          className="absolute right-8 sm:right-10 text-white/25 hover:text-white/60 transition-colors"
        >
          <IconChevronRight size={12} />
        </motion.button>

        {/* Close */}
        <motion.button
          type="button"
          onClick={() => setDismissed(true)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Fechar promoções"
          className="absolute right-3 text-white/20 hover:text-white/50 transition-colors"
        >
          <IconX size={10} />
        </motion.button>
      </div>
    </div>
  );
}