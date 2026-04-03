// src/components/book/BookCarousel.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants, PanInfo } from "framer-motion";
import { createPortal } from "react-dom";
import { IconChevronLeft, IconChevronRight, IconX, IconSearch } from "../Icons";
import type { ProductImage } from "../../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookCarouselProps {
  images: ProductImage[];
  name: string;
  category: string;
  badge?: string | null;
  showBadge?: boolean;
  showDots?: boolean;
  showThumbnailGrid?: boolean;
  showDecorations?: boolean;
  className?: string;
}

type Direction = -1 | 1;

// ─── Config ───────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 8_000;
const AUTOPLAY_DELAY_MS = 4_500;
const ZOOM_SCALE = 2.4;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function swipePower(offset: number, velocity: number) {
  return Math.abs(offset) * Math.abs(velocity);
}

function wrap(index: number, length: number) {
  return ((index % length) + length) % length;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, x: -10 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const slideVariants: Variants = {
  enter: (dir: Direction) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, zIndex: 1, transition: { x: { type: "spring", stiffness: 320, damping: 32 }, opacity: { duration: 0.2 } } },
  exit: (dir: Direction) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0, zIndex: 0, transition: { x: { type: "spring", stiffness: 320, damping: 32 }, opacity: { duration: 0.2 } } }),
};

const lightboxVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const lightboxImgVariants: Variants = {
  enter: (dir: Direction) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir: Direction) => ({ x: dir < 0 ? 60 : -60, opacity: 0, scale: 0.97, transition: { duration: 0.2, ease: [0.7, 0, 1, 1] } }),
};

// ─── Placeholder ──────────────────────────────────────────────────────────────

function CarouselPlaceholder({ category, className }: { category: string; className?: string }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative aspect-[3/4] w-full max-w-sm mx-auto border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.01] flex flex-col items-center justify-center gap-3 overflow-hidden ${className}`}
    >
      <span
        className="relative z-10 font-black text-white/[0.08] select-none"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(60px,10vw,100px)" }}
      >
        M
      </span>
      <span className="relative z-10 font-sans text-[10px] tracking-[0.22em] uppercase text-white/20">
        {category}
      </span>
    </motion.div>
  );
}

// ─── NavButton ────────────────────────────────────────────────────────────────

function NavButton({ side, visible, onClick }: { side: "left" | "right"; visible: boolean; onClick: (e: React.MouseEvent) => void }) {
  const isLeft = side === "left";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "Imagem anterior" : "Próxima imagem"}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : (isLeft ? -4 : 4) }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={[
        "absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8",
        "border border-white/[0.14] bg-black/45 backdrop-blur-sm",
        "flex items-center justify-center text-white/50",
        "hover:text-white hover:border-white/30 transition-colors duration-150",
        isLeft ? "left-2" : "right-2",
        !visible && "pointer-events-none",
      ].join(" ")}
    >
      {isLeft ? <IconChevronLeft size={13} /> : <IconChevronRight size={13} />}
    </motion.button>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: ProductImage[];
  name: string;
  index: number;
  onClose: () => void;
  onNav: (dir: Direction) => void;
}

function Lightbox({ images, name, index, onClose, onNav }: LightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>(1);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleNav = useCallback((dir: Direction) => {
    setZoomed(false);
    setPan({ x: 0, y: 0 });
    setDirection(dir);
    onNav(dir);
  }, [onNav]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNav(1);
      if (e.key === "ArrowLeft") handleNav(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, handleNav]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleImgClick = () => {
    if (!zoomed) {
      setZoomed(true);
      setPan({ x: 0, y: 0 });
    } else {
      setZoomed(false);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!zoomed) return;
    e.preventDefault();
    setPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!panning || !zoomed) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };

  const handleMouseUp = () => setPanning(false);

  return createPortal(
    <motion.div
      variants={lightboxVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-modal="true"
      aria-label={`Visualizador: ${name}`}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="fixed top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-black/60 text-white/50 hover:text-white hover:border-white/25 transition-all"
      >
        <IconX size={15} />
      </button>

      {/* Image */}
      <div
        className="relative flex items-center justify-center"
        style={{ maxWidth: "min(90vw, 680px)", maxHeight: "90vh" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={index}
            ref={imgRef}
            src={images[index].image_url}
            alt={`${name} — imagem ${index + 1}`}
            custom={direction}
            variants={lightboxImgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onClick={handleImgClick}
            onMouseDown={handleMouseDown}
            draggable={false}
            style={{
              maxWidth: "100%",
              maxHeight: "88vh",
              objectFit: "contain",
              border: "1px solid rgba(255,255,255,0.07)",
              transform: zoomed
                ? `scale(${ZOOM_SCALE}) translate(${pan.x / ZOOM_SCALE}px, ${pan.y / ZOOM_SCALE}px)`
                : "scale(1)",
              transition: panning ? "none" : "transform 0.28s cubic-bezier(0.16,1,0.3,1)",
              cursor: zoomed ? (panning ? "grabbing" : "grab") : "zoom-in",
              userSelect: "none",
            }}
          />
        </AnimatePresence>
      </div>

      {/* Nav — left */}
      <button
        type="button"
        onClick={() => handleNav(-1)}
        aria-label="Imagem anterior"
        className="fixed left-5 top-1/2 -translate-y-1/2 w-11 h-11 border border-white/10 bg-black/55 flex items-center justify-center text-white/45 hover:text-white hover:border-white/25 transition-all"
      >
        <IconChevronLeft size={16} />
      </button>

      {/* Nav — right */}
      <button
        type="button"
        onClick={() => handleNav(1)}
        aria-label="Próxima imagem"
        className="fixed right-5 top-1/2 -translate-y-1/2 w-11 h-11 border border-white/10 bg-black/55 flex items-center justify-center text-white/45 hover:text-white hover:border-white/25 transition-all"
      >
        <IconChevronRight size={16} />
      </button>

      {/* Footer counter + hint */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-5"
        style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}
      >
        <span style={{ color: "rgba(255,255,255,0.3)" }}>
          {pad(index + 1)} / {pad(images.length)}
        </span>
        <span
          className="flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          <IconSearch size={11} />
          {zoomed ? "Clique para reduzir · arraste para mover" : "Clique na imagem para ampliar"}
        </span>
      </div>
    </motion.div>,
    document.body
  );
}

// ─── BookCarousel ─────────────────────────────────────────────────────────────

export function BookCarousel({
  images,
  name,
  category,
  badge,
  showBadge = true,
  showDots = true,
  showThumbnailGrid = true,
  showDecorations = true,
  className = "",
}: BookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasImages = images && images.length > 0;
  const hasMultiple = images && images.length > 1;

  // ── Navigation ────────────────────────────────────────────────────────
  const paginate = useCallback((dir: Direction, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(dir);
    setCurrentIndex((prev) => wrap(prev + dir, images.length));
  }, [images]);

  const goTo = useCallback((index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const dir: Direction = index > currentIndex ? 1 : -1;
    setDirection(dir);
    setCurrentIndex(index);
  }, [currentIndex]);

  // ── Autoplay ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasMultiple || isPaused || isHovered || lightboxOpen) return;
    timerRef.current = setTimeout(() => paginate(1), AUTOPLAY_DELAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentIndex, hasMultiple, isPaused, isHovered, lightboxOpen, paginate]);

  // ── Swipe ─────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const power = swipePower(offset.x, velocity.x);
    if (power < -SWIPE_THRESHOLD) paginate(1);
    else if (power > SWIPE_THRESHOLD) paginate(-1);
  }, [paginate]);

  // ── Keyboard (carousel, when lightbox is closed) ───────────────────────
  useEffect(() => {
    if (lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, paginate]);

  // ── Lightbox nav (syncs with main carousel) ───────────────────────────
  const handleLightboxNav = useCallback((dir: Direction) => {
    paginate(dir);
  }, [paginate]);

  if (!hasImages) return <CarouselPlaceholder category={category} className={className} />;

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative group select-none ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPaused(false); }}
      >
        {/* ── Badge ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {badge && showBadge && (
            <motion.span
              key="badge"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-3 -right-3 z-20 bg-white text-black font-sans text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 pointer-events-none"
            >
              {badge}
            </motion.span>
          )}
        </AnimatePresence>

        {/* ── Main Stage ────────────────────────────────────────────── */}
        <div
          role="region"
          aria-label={`Galeria: ${name}`}
          aria-live="polite"
          className="relative aspect-[3/4] w-full max-w-lg mx-auto border border-white/[0.08] overflow-hidden bg-black"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].image_url}
              alt={`${name} — imagem ${currentIndex + 1} de ${images.length}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={hasMultiple ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
            />
          </AnimatePresence>

          {/* gradient vignette */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none z-10"
            style={{ background: "linear-gradient(to top,rgba(0,0,0,0.65),transparent)" }}
          />

          {/* zoom button */}
          <motion.button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
            aria-label="Ampliar imagem"
            title="Ampliar imagem"
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.85 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full border border-white/[0.14] bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/55 hover:text-white hover:border-white/30 transition-colors"
            style={{ pointerEvents: isHovered ? "all" : "none" }}
          >
            <IconSearch size={13} />
          </motion.button>

          {/* counter */}
          {hasMultiple && (
            <div className="absolute bottom-3.5 left-4 z-20">
              <span className="font-sans text-[9px] tracking-[0.18em] text-white/40 tabular-nums">
                {pad(currentIndex + 1)}
                <span className="text-white/18 mx-1">/</span>
                {pad(images.length)}
              </span>
            </div>
          )}

          {/* autoplay progress */}
          {hasMultiple && !isPaused && !isHovered && (
            <motion.div
              key={`progress-${currentIndex}`}
              className="absolute bottom-0 left-0 h-0.5 bg-white/18 z-20"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: AUTOPLAY_DELAY_MS / 1000, ease: "linear" }}
            />
          )}

          {/* nav arrows */}
          {hasMultiple && (
            <>
              <NavButton side="left" visible={isHovered} onClick={(e) => { setIsPaused(true); paginate(-1, e); }} />
              <NavButton side="right" visible={isHovered} onClick={(e) => { setIsPaused(true); paginate(1, e); }} />
            </>
          )}
        </div>

        {/* ── Dot indicators ────────────────────────────────────────── */}
        {hasMultiple && showDots && (
          <div role="tablist" aria-label="Selecionar imagem" className="flex items-center justify-center gap-1.5 mt-4">
            {images.map((_, i) => {
              const isActive = i === currentIndex;
              return (
                <motion.button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Imagem ${i + 1}`}
                  onClick={(e) => { setIsPaused(true); goTo(i, e); }}
                  animate={{
                    width: isActive ? 20 : 5,
                    backgroundColor: isActive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.16)",
                  }}
                  whileHover={isActive ? {} : { backgroundColor: "rgba(255,255,255,0.38)" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-px"
                />
              );
            })}
          </div>
        )}

        {/* ── Thumbnail Grid ─────────────────────────────────────────── */}
        {hasMultiple && showThumbnailGrid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5"
          >
            {/* grid label */}
            <p
              className="mb-3"
              style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}
            >
              Todas as imagens
            </p>

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))" }}
            >
              {images.map((img, i) => {
                const isActive = i === currentIndex;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    aria-label={`Ver imagem ${i + 1}`}
                    onClick={(e) => { setIsPaused(true); goTo(i, e); }}
                    animate={{
                      borderColor: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.07)",
                      opacity: isActive ? 1 : 0.4,
                    }}
                    whileHover={{ opacity: isActive ? 1 : 0.78 }}
                    transition={{ duration: 0.2 }}
                    className="relative aspect-[3/4] border overflow-hidden group/thumb"
                    style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <img
                      src={img.image_url}
                      alt={`Miniatura ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                    />

                    {/* hover overlay com ícone de zoom */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.42)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(i);
                        setLightboxOpen(true);
                      }}
                    >
                      <IconSearch size={13} className="text-white/75" />
                    </motion.div>

                    {/* active indicator line */}
                    {isActive && (
                      <motion.div
                        layoutId="thumb-active"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ background: "rgba(255,255,255,0.7)" }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Decorative rings ──────────────────────────────────────── */}
        {showDecorations && (
          <>
            <div aria-hidden="true" className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full border border-white/[0.04] pointer-events-none -z-10" />
            <div aria-hidden="true" className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full border border-white/[0.02] pointer-events-none -z-10" />
          </>
        )}
      </motion.div>

      {/* ── Lightbox portal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            name={name}
            index={currentIndex}
            onClose={() => setLightboxOpen(false)}
            onNav={handleLightboxNav}
          />
        )}
      </AnimatePresence>
    </>
  );
}