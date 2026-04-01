import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import logoImg from "../assets/logo.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SplashScreenProps {
  onLoadingComplete: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION_MS = 3200;

const LOADING_STEPS = [
  "Inicializando plataforma",
  "Carregando biblioteca",
  "Preparando conteúdo",
  "Quase lá",
] as const;

// ─── Animated counter sub-component ──────────────────────────────────────────

interface AnimatedNumberProps {
  to: number;
  duration: number;
}

function AnimatedNumber({ to, duration }: AnimatedNumberProps) {
  const motionVal = useMotionValue(0);
  const rounded   = useTransform(motionVal, (v) => Math.floor(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, to, {
      duration: duration / 1000,
      ease: "easeInOut",
    });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [to, duration, motionVal, rounded]);

  return <>{display}</>;
}

// ─── Main component ───────────────────────────────────────────────────────────

const SplashScreen: React.FC<SplashScreenProps> = ({ onLoadingComplete }) => {
  const [progress,  setProgress]  = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [reveal,    setReveal]    = useState(false);
  const [exiting,   setExiting]   = useState(false);
  const startTime = useRef<number>(0);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    let mounted = true;
    startTime.current = Date.now();

    const tick = () => {
      if (!mounted) return;

      const elapsed = Date.now() - startTime.current;
      const raw     = Math.min(elapsed / DURATION_MS, 1);
      const eased   = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;

      setProgress(Math.floor(eased * 100));
      setStepIndex(Math.min(Math.floor(eased * LOADING_STEPS.length), LOADING_STEPS.length - 1));

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => { if (mounted) setReveal(true); }, 200);
        setTimeout(() => {
          if (!mounted) return;
          setExiting(true);
          setTimeout(() => { if (mounted) onLoadingComplete(); }, 700);
        }, 1000);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { mounted = false; cancelAnimationFrame(rafRef.current); };
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden select-none"
        >
          {/* ── Noise texture ──────────────────────────────────────────── */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* ── Decorative concentric rings ────────────────────────────── */}
          {[1, 0.6, 0.25].map((opacity, i) => (
            <motion.div
              key={i}
              aria-hidden="true"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: opacity * 0.08 }}
              transition={{ duration: 1.2, delay: i * 0.18, ease: "easeOut" }}
              className="absolute rounded-full border border-white pointer-events-none"
              style={{ width: `${320 + i * 160}px`, height: `${320 + i * 160}px` }}
            />
          ))}

          {/* ── Vertical accent line ───────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent pointer-events-none"
            style={{ left: "50%", transformOrigin: "top" }}
          />

          {/* ── Logo block ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative z-10 flex flex-col items-center mb-6"
          >
            {/* Logo image */}
            <motion.div
              initial={{ scale: 0.82, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1,    opacity: 1, filter: "blur(0px)"  }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative w-28 h-28 md:w-40 md:h-40"
            >
              <img
                src={logoImg}
                alt="Modus Focus"
                className="w-full h-full object-contain brightness-0 invert opacity-85"
              />
              {/* Ambient glow behind logo */}
              <motion.div
                animate={{ opacity: [0.15, 0.45, 0.15], scale: [1, 1.08, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-white/20 blur-3xl rounded-full -z-10"
              />
            </motion.div>

            {/* Subtle tagline below logo */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="mt-6 tracking-[0.32em] uppercase text-white/80 text-center"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9 }}
            >
              Mentis Dominus
            </motion.p>
          </motion.div>

          {/* ── Progress area ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative z-10 w-full max-w-[340px] px-6"
          >
            {/* Label row */}
            <div className="flex items-center justify-between mb-3">
              <div className="overflow-hidden h-4 relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stepIndex}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0,   opacity: 1 }}
                    exit={{ y: -14,    opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="absolute uppercase tracking-[0.18em] text-white/35"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}
                  >
                    {LOADING_STEPS[stepIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              <span
                className="text-white/55 font-bold tabular-nums"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 13 }}
              >
                <AnimatedNumber to={100} duration={DURATION_MS} />
                <span className="text-white/25 font-light text-[11px] ml-0.5">%</span>
              </span>
            </div>

            {/* Progress track */}
            <div className="relative h-px w-full bg-white/10 overflow-visible">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white origin-left"
                style={{ width: `${progress}%` }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white"
                style={{ left: `${progress}%`, boxShadow: "0 0 8px 2px rgba(255,255,255,0.6)" }}
              />
            </div>

            {/* Tick marks */}
            <div className="flex justify-between mt-1.5">
              {[0, 25, 50, 75, 100].map((mark) => (
                <div key={mark} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-px h-1.5 transition-colors duration-300"
                    style={{ background: progress >= mark ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)" }}
                  />
                  <span
                    className="transition-colors duration-300"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 8,
                      letterSpacing: "0.1em",
                      color: progress >= mark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    {mark}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Reveal flash at 100% ───────────────────────────────────── */}
          <AnimatePresence>
            {reveal && (
              <motion.div
                key="flash"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.12, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 bg-white pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* ── Bottom corner labels ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-8 left-10 right-10 flex justify-between items-center"
          >
            <span
              className="text-white/15 tracking-[0.2em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9 }}
            >
              © 2025 Modus Focus
            </span>
            <span
              className="text-white/15 tracking-[0.2em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9 }}
            >
              v2.1.2
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;