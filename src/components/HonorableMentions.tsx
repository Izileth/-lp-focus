import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  IconShield,
  IconTrendingUp,
  IconZap,
  IconAward,
  IconCheckCircle,
  IconUser,
  IconChevronLeft,
  IconChevronRight,
} from "./Icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Person {
  index:    string;
  name:     string;
  namePt2:  string;
  role:     string;
  quotes:   string[];
  lesson:   string;
  icon:     React.ReactNode;
  imageUrl: string;
  bgColor:  string; // rgba — ex: "rgba(60,8,18,0.78)"
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Substitua cada imageUrl pela URL real da imagem de cada personagem.

const PEOPLE: Person[] = [
  {
    index:    "01",
    name:     "Tony",
    namePt2:  "Montana",
    role:     "Scarface",
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1400&q=85&fit=crop",
    bgColor:  "rgba(60,8,18,0.78)",
    icon:     <IconShield size={16} />,
    quotes: [
      "Tudo que tenho neste mundo são minhas palavras e minha coragem.",
      "Os olhos, cara — eles nunca mentem.",
      "Todo homem tem seu dia.",
    ],
    lesson:
      "Honra, inteligência e visão são as verdadeiras armas que levam alguém do nada ao topo.",
  },
  {
    index:    "02",
    name:     "Jordan",
    namePt2:  "Belfort",
    role:     "The Wolf of Wall Street",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&q=85&fit=crop",
    bgColor:  "rgba(8,18,44,0.78)",
    icon:     <IconTrendingUp size={16} />,
    quotes: [
      "A única coisa entre você e seu objetivo é a história que continua se contando.",
      "Aja como um homem rico e confiante, e você se tornará um.",
      "Vencedores usam 'eu vou'. Perdedores usam 'eu tento'.",
    ],
    lesson:
      "Dominar a mente, vendas e persuasão permite mudar completamente sua realidade.",
  },
  {
    index:    "03",
    name:     "Tyler",
    namePt2:  "Durden",
    role:     "Fight Club",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=85&fit=crop",
    bgColor:  "rgba(22,8,36,0.78)",
    icon:     <IconZap size={16} />,
    quotes: [
      "Só depois de perdermos tudo é que somos livres para qualquer coisa.",
      "As coisas que você possui acabam possuindo você.",
      "Destruir velhos padrões é às vezes o verdadeiro caminho.",
    ],
    lesson:
      "Quebrar padrões mentais impostos pela sociedade liberta a mente para criar novos caminhos.",
  },
  {
    index:    "04",
    name:     "Grandes",
    namePt2:  "Generais",
    role:     "Kingdom",
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=1400&q=85&fit=crop",
    bgColor:  "rgba(10,18,2,0.78)",
    icon:     <IconAward size={16} />,
    quotes: [
      "Um grande general vence a guerra antes da batalha começar.",
      "A força ganha batalhas, mas a estratégia conquista reinos.",
      "Quem entende o campo vence mesmo sendo o mais fraco.",
    ],
    lesson:
      "Conhecimento estratégico e antecipação sempre superam a força bruta.",
  },
  {
    index:    "05",
    name:     "Elon",
    namePt2:  "Musk",
    role:     "Inovação Tecnológica",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=85&fit=crop",
    bgColor:  "rgba(0,18,32,0.78)",
    icon:     <IconZap size={16} />,
    quotes: [
      "Quando algo é importante o suficiente, você faz mesmo contra as probabilidades.",
      "Você precisa abraçar a mudança se a alternativa for o desastre.",
      "Penso em princípios fundamentais, não por analogia.",
    ],
    lesson:
      "Pensar profundamente e aprender constantemente é o que permite quebrar limites.",
  },
  {
    index:    "06",
    name:     "Warren",
    namePt2:  "Buffett",
    role:     "Estratégia Financeira",
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=85&fit=crop",
    bgColor:  "rgba(18,16,0,0.78)",
    icon:     <IconCheckCircle size={16} />,
    quotes: [
      "Quanto mais você aprende, mais você ganha.",
      "O melhor investimento que pode fazer é em você mesmo.",
      "O risco vem de não saber o que você está fazendo.",
    ],
    lesson:
      "Conhecimento financeiro e aprendizado contínuo são a base para riqueza perene.",
  },
  {
    index:    "07",
    name:     "Steve",
    namePt2:  "Jobs",
    role:     "Visão Criativa",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=85&fit=crop",
    bgColor:  "rgba(0,16,16,0.78)",
    icon:     <IconUser size={16} />,
    quotes: [
      "Continue com fome, continue tolo.",
      "A inovação distingue um líder de um seguidor.",
      "Quem é louco o suficiente para pensar que muda o mundo, realmente o faz.",
    ],
    lesson:
      "Criatividade, visão e conhecimento profundo podem transformar indústrias inteiras.",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const AUTOPLAY_MS = 7_000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const slideEnterRight: Variants = {
  initial: { opacity: 0, x: 52 },
};
const slideEnterLeft: Variants = {
  initial: { opacity: 0, x: -52 },
};

const slideAnimate: Variants = {
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideExitLeft = {
  opacity: 0,
  x: -36,
  transition: { duration: 0.35, ease: [0.7, 0, 1, 1] as number[] },
};

const slideExitRight = {
  opacity: 0,
  x: 36,
  transition: { duration: 0.35, ease: [0.7, 0, 1, 1] as number[] },
};

const contentStagger: Variants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.06, delayChildren: 0.14 } },
};

const fadeUp: Variants = {
  hidden:   { opacity: 0, y: 22 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ─── SlideBg — imagem + Ken Burns + overlays ─────────────────────────────────

function SlideBg({ person, isActive }: { person: Person; isActive: boolean }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">

      {/* Wrapper Ken Burns — 110% para dar margem ao zoom sem cortar */}
      <div
        style={{
          position:   "absolute",
          width:      "110%",
          height:     "110%",
          top:        "-5%",
          left:       "-5%",
          animation:  isActive ? "kenBurns 14s ease-in-out infinite" : "none",
          willChange: "transform",
        }}
      >
        <img
          src={person.imageUrl}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-top"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Tint cromático — identidade visual de cada personagem */}
      <div
        className="absolute inset-0"
        style={{
          background:   person.bgColor,
          mixBlendMode: "multiply",
        }}
      />

      {/* Gradiente vertical — legibilidade do texto na base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 38%, rgba(0,0,0,0.15) 72%, transparent 100%)",
        }}
      />

      {/* Vignette lateral esquerda — ancora o bloco de texto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 55%)",
        }}
      />
    </div>
  );
}

// ─── SlideView ────────────────────────────────────────────────────────────────

function SlideView({
  person,
  direction,
  isActive,
}: {
  person:    Person;
  direction: 1 | -1;
  isActive:  boolean;
}) {
  const enterInitial = direction > 0
    ? slideEnterRight.initial
    : slideEnterLeft.initial;

  const exitTarget = direction > 0 ? slideExitLeft : slideExitRight;

  return (
    <motion.div
      key={person.index}
      className="absolute inset-0 flex flex-col justify-end"
      style={{
        padding: "clamp(28px,6vw,72px) clamp(24px,7vw,96px)",
      }}
      initial={enterInitial as object}
      animate={slideAnimate.animate as object}
      exit={exitTarget}
    >
      {/* Background com imagem + Ken Burns */}
      <SlideBg person={person} isActive={isActive} />

      {/* Número watermark */}
      <span
        aria-hidden="true"
        className="absolute select-none pointer-events-none leading-none"
        style={{
          fontFamily:  "'Playfair Display', serif",
          fontWeight:  900,
          fontSize:    "clamp(100px,20vw,260px)",
          color:       "rgba(255,255,255,0.032)",
          letterSpacing: "-0.04em",
          zIndex:      2,
          bottom:      -10,
          right:       "clamp(-10px,-2vw,20px)",
        }}
      >
        {person.index}
      </span>

      {/* Conteúdo com stagger */}
      <motion.div
        className="relative max-w-[800px]"
        style={{ zIndex: 3 }}
        variants={contentStagger}
        initial="hidden"
        animate="visible"
      >
        {/* Índice */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 mb-5"
          style={{
            fontSize:      11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         "rgba(255,255,255,0.28)",
          }}
        >
          <span
            style={{
              width:      28,
              height:     1,
              background: "rgba(255,255,255,0.22)",
              display:    "block",
              flexShrink: 0,
            }}
          />
          {person.index} / {pad(PEOPLE.length)}
        </motion.div>

        {/* Role */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize:      "clamp(10px,1.2vw,12px)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color:         "rgba(255,255,255,0.42)",
            fontWeight:    700,
            marginBottom:  14,
          }}
        >
          {person.role}
        </motion.p>

        {/* Nome */}
        <motion.h3
          variants={fadeUp}
          style={{
            fontFamily:    "'Playfair Display', serif",
            fontSize:      "clamp(44px,9vw,110px)",
            fontWeight:    900,
            lineHeight:    0.95,
            letterSpacing: "-0.03em",
            color:         "#fff",
            marginBottom:  28,
            wordBreak:     "break-word",
          }}
        >
          {person.name}
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.32)" }}>
            {person.namePt2}
          </em>
        </motion.h3>

        {/* Citações */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-3 mb-7"
          style={{
            borderLeft:  "1px solid rgba(255,255,255,0.14)",
            paddingLeft: 20,
          }}
        >
          {person.quotes.map((q, qi) => (
            <p
              key={qi}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle:  "italic",
                fontSize:   "clamp(13px,1.7vw,17px)",
                lineHeight: 1.65,
                color:      qi === 0
                  ? "rgba(255,255,255,0.88)"
                  : "rgba(255,255,255,0.44)",
              }}
            >
              "{q}"
            </p>
          ))}
        </motion.div>

        {/* Lição */}
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-4"
          style={{ maxWidth: 500 }}
        >
          <div
            style={{
              width:          36,
              height:         36,
              flexShrink:     0,
              border:         "1px solid rgba(255,255,255,0.12)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "rgba(255,255,255,0.38)",
              marginTop:      2,
            }}
          >
            {person.icon}
          </div>
          <div className="flex flex-col gap-1">
            <span
              style={{
                fontSize:      9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,0.2)",
                display:       "block",
              }}
            >
              A lição
            </span>
            <p
              style={{
                fontSize:   "clamp(12px,1.3vw,14px)",
                lineHeight: 1.75,
                color:      "rgba(255,255,255,0.38)",
                fontWeight: 300,
              }}
            >
              {person.lesson}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── HonorableMentionsSection ─────────────────────────────────────────────────

export function HonorableMentionsSection() {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX               = useRef(0);

  const goTo = useCallback((next: number, dir: 1 | -1) => {
    const idx = ((next % PEOPLE.length) + PEOPLE.length) % PEOPLE.length;
    setDirection(dir);
    setCurrent(idx);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => goTo(idx + 1, 1), AUTOPLAY_MS);
  }, []);

  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1,  1), [current, goTo]);

  // Autoplay inicial
  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(1, 1), AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [goTo]);

  // Teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  // Swipe touch
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) {
      dx < 0 ? next() : prev();
    }
  };

  return (
    <section
      id="hall"
      className="relative bg-black overflow-hidden border-t border-white/[0.06]"
    >
      {/* ── Cabeçalho da seção ──────────────────────────────────────────── */}
      <div
        className="relative bg-black"
        style={{
          zIndex:  5,
          padding: "clamp(36px,6vw,80px) clamp(24px,7vw,96px) 0",
        }}
      >
        <span
          style={{
            display:       "block",
            fontSize:      10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         "rgba(255,255,255,0.28)",
            borderLeft:    "2px solid rgba(255,255,255,0.18)",
            paddingLeft:   12,
            marginBottom:  20,
          }}
        >
          Hall da Fama
        </span>

        <h2
          style={{
            fontFamily:    "'Playfair Display', serif",
            fontSize:      "clamp(36px,6vw,80px)",
            fontWeight:    900,
            lineHeight:    1.0,
            letterSpacing: "-0.03em",
            color:         "#fff",
            marginBottom:  20,
          }}
        >
          Mentes que
          <br />
          <em style={{ fontStyle: "normal", color: "rgba(255,255,255,0.28)" }}>
            Dominaram
          </em>
          <br />
          o Jogo.
        </h2>

        <p
          style={{
            fontSize:     "clamp(13px,1.4vw,15px)",
            color:        "rgba(255,255,255,0.35)",
            lineHeight:   1.8,
            fontWeight:   300,
            maxWidth:     480,
            marginBottom: 32,
          }}
        >
          Honramos aqueles que entenderam que o conhecimento, a estratégia e a
          força mental são os únicos ativos que ninguém pode tirar de você.
        </p>

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* ── Viewport do carousel ─────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          height:    "min(100svh, 860px)",
          minHeight: 580,
        }}
        role="region"
        aria-label="Hall da Fama — slides"
        aria-live="polite"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence custom={direction} mode="wait">
          <SlideView
            key={current}
            person={PEOPLE[current]}
            direction={direction}
            isActive={true}
          />
        </AnimatePresence>

        {/* Barra de progresso do autoplay */}
        <motion.div
          key={`prog-${current}`}
          className="absolute bottom-0 left-0 h-px"
          style={{
            background: "rgba(255,255,255,0.22)",
            zIndex:     10,
          }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
        />
      </div>

      {/* ── Barra de controles ────────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-between bg-black border-t border-white/[0.06]"
        style={{
          zIndex:  10,
          padding: "20px clamp(24px,7vw,96px)",
        }}
      >
        {/* Dots */}
        <div className="flex items-center gap-2">
          {PEOPLE.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              aria-label={`Ir para slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              animate={{
                width:           i === current ? 24 : 6,
                backgroundColor: i === current
                  ? "rgba(255,255,255,0.72)"
                  : "rgba(255,255,255,0.18)",
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height:       2,
                borderRadius: 1,
                cursor:       "pointer",
                border:       "none",
                padding:      0,
              }}
            />
          ))}
        </div>

        {/* Contador */}
        <span
          style={{
            fontSize:      11,
            letterSpacing: "0.2em",
            color:         "rgba(255,255,255,0.2)",
          }}
        >
          {pad(current + 1)} / {pad(PEOPLE.length)}
        </span>

        {/* Setas */}
        <div className="flex items-center gap-2">
          {(
            [
              { fn: prev, Icon: IconChevronLeft,  label: "Anterior" },
              { fn: next, Icon: IconChevronRight, label: "Próximo"  },
            ] as const
          ).map(({ fn, Icon, label }) => (
            <motion.button
              key={label}
              type="button"
              aria-label={label}
              onClick={fn}
              whileHover={{ borderColor: "rgba(255,255,255,0.28)", color: "#fff" }}
              whileTap={{ scale: 0.9 }}
              style={{
                width:          40,
                height:         40,
                border:         "1px solid rgba(255,255,255,0.1)",
                background:     "none",
                color:          "rgba(255,255,255,0.4)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                cursor:         "pointer",
              }}
            >
              <Icon size={14} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Linha decorativa de rodapé */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-px origin-left"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />
    </section>
  );
}