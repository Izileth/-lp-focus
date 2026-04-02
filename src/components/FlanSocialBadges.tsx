// src/components/SocialFanBadge.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconTiktok, IconInstagram, IconWhatsapp, IconArrowUpRight, IconYoutube} from "./Icons";
import type { Variants } from "framer-motion";
// ─── Types ──────────────────────────────────────────────────────────────────

interface SocialItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

// ─── Socials ────────────────────────────────────────────────────────────────



const SOCIALS: SocialItem[] = [
  {
    id: "whatsapp",
    label: "",
    href: "https://chat.whatsapp.com/D5araq1cWrS18jcaon0fnX",
    icon: <IconWhatsapp />,
    color: "#25D366",
  },
  {
    id: "instagram",
    label: "",
    href: "https://www.instagram.com/focus_billionaiire?igsh=Z2hlMjZxZ3RkNmht&utm_source=qr",
    icon: <IconInstagram />,
    color: "#E1306C",
  },
  {
    id: "tiktok",
    label: "",
    href: "https://www.tiktok.com/@potencial_marco_zero?_r=1&_t=ZS-95DGkpALbMG",
    icon: <IconTiktok />,
    color: "#fff",
  },
  {
    id: "youtube",
    label: "",
    href: "https://youtu.be/KkKlfAb3TSI?si=T7uMqaVcSp_svRq2",
    icon: <IconYoutube />,
    color: "#ee3226",
  },

];

// ─── Posições do leque ──────────────────────────────────────────────────────

const FAN_POSITIONS_MOBILE = [
  { x: 0,  y: -70 },
  { x: 28, y: -55 },
  { x: 55, y: -30 },
  { x: 75, y: -5 },   // 👈 NOVO
];

const FAN_POSITIONS_DESKTOP = [
  { x: 0,   y: -95 },
  { x: 45,  y: -75 },
  { x: 90,  y: -45 },
  { x: 130, y: -10 }, // 👈 NOVO
];

// ─── Variants ───────────────────────────────────────────────────────────────

const itemVariants: Variants = {
  closed: (custom: [number, any[]]) => {
    const [i] = custom;

    return {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.4,
      transition: {
        duration: 0.25,
        ease: [0.42, 0, 0.58, 1],
        delay: (SOCIALS.length - i) * 0.03,
      },
    };
  },

  open: (custom: [number, any[]]) => {
    const [i, positions] = custom;

    return {
      x: positions[i].x,
      y: positions[i].y,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1],
        delay: i * 0.05,
      },
    };
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

export function SocialFanBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Detecta mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const positions = isMobile
    ? FAN_POSITIONS_MOBILE
    : FAN_POSITIONS_DESKTOP;

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50"
    >
      {/* Social items */}
      {SOCIALS.map((social, i) => (
        <motion.a
          key={social.id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          custom={[i, positions]}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={itemVariants}
          whileHover={{
            scale: 1.08,
            y: -3,
          }}
          whileTap={{ scale: 0.92 }}
          className="
          group
          absolute bottom-0 left-0
          flex items-center justify-center
          w-11 h-11 sm:w-12 sm:h-12
          rounded-md
          bg-black/60 backdrop-blur-xl
          border border-white/10
          shadow-[0_4px_20px_rgba(0,0,0,0.3)]
          transition-all duration-300
        "
          style={{
            pointerEvents: isOpen ? "all" : "none",
          }}
        >
          {/* Ícone */}
          <div
            className="
            flex items-center justify-center
            text-white/60
            group-hover:text-white
            transition-all duration-300
          "
          >
            {social.icon}
          </div>

          {/* Glow sutil no hover */}
          <div
            className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition duration-300"
            style={{
              boxShadow: `0 0 18px ${social.color}40`,
            }}
          />

          {/* Tooltip */}
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="
                absolute left-14
                text-[10px]
                uppercase tracking-[0.18em]
                text-white/50
                whitespace-nowrap
              "
              >
                {social.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>
      ))}

      {/* Trigger */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileTap={{ scale: 0.9 }}
        className="
        relative z-10
        flex items-center justify-center
        w-12 h-12 sm:w-14 sm:h-14
        rounded-md
        bg-black/70 backdrop-blur-xl
        border border-white/10
        shadow-[0_6px_30px_rgba(0,0,0,0.4)]
        transition-all duration-300
        hover:border-white/20
      "
      >
        <motion.div
          animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center"
        >
          <IconArrowUpRight
            size={16}
            className="text-white/60 group-hover:text-white transition"
          />
        </motion.div>
      </motion.button>
    </div>
  );
}