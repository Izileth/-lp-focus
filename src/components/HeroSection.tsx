// src/components/HeroSection.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import { supabase } from "../lib/supabaseClient";
import { IconArrowRight } from "./Icons";
import { VideoBackground } from "./VideoBackground";
import { ScrambleText } from "./ui/HeaderText";

interface PublicStats {
  titles_count: number;
  avg_rating: number;
  readers_count: number;
}

export function HeroSection() {
  const [stats, setStats] = useState<PublicStats>({
    titles_count: 0,
    avg_rating: 4.9,
    readers_count: 3000,
  });

  const videoPlaylist = [
    "https://v1.pinimg.com/videos/iht/expMp4/e9/e6/3c/e9e63c701406e2e4ebdf5e540db3b7c6_720w.mp4",
    "https://v1.pinimg.com/videos/iht/expMp4/73/10/0a/73100ac3ba00396f3c30bd44e558dce6_720w.mp4",
    "https://v1.pinimg.com/videos/iht/expMp4/3c/66/82/3c6682f50ce9e73a6305fd549d25d18e_720w.mp4"
  ];

  useEffect(() => {
    async function fetchPublicStats() {
      try {
        const { data, error } = await supabase.rpc("get_public_stats");
        if (error) throw error;
        if (data) setStats(data);
      } catch (err) {
        console.error("Error fetching public stats:", err);
      }
    }
    fetchPublicStats();
  }, []);

  const displayStats = [
    { value: `${stats.titles_count}+`, label: "Títulos" },
    { value: stats.avg_rating.toFixed(1), label: "Avaliação" },
    { value: `${(stats.readers_count / 1000).toFixed(1)}k+`, label: "Leitores" },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center px-10 pt-32 pb-20 relative overflow-hidden bg-black">
      {/* Cinematic Video Background with Gradients and Playlist */}
      <VideoBackground 
        videoSources={videoPlaylist} 
        overlayOpacity={0.4}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto w-full relative z-10"
      >
        {/* Eyebrow */}
        <motion.div variants={fadeUpVariants} className="mb-6">
          <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/50 border-l-2 border-white/40 pl-3.5 backdrop-blur-[2px]">
            Plataforma de Conhecimento
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUpVariants}
          className="[font-family:'Playfair_Display',serif] font-black leading-[0.92] tracking-[-0.02em] mb-8 max-w-[800px] text-white"
          style={{ fontSize: "clamp(52px,9vw,120px)" }}
        >
            <ScrambleText />
          <br />
          <em className="not-italic text-white/80">que transforma.</em>
        </motion.h1>

        {/* Body */}
        <motion.p
          variants={fadeUpVariants}
          className="font-sans font-light leading-[1.7] text-white/70 mb-12 max-w-[460px] drop-shadow-sm"
          style={{ fontSize: "clamp(15px,1.5vw,18px)" }}
        >
          Ebooks cuidadosamente selecionados para quem busca evolução real.
          Conteúdo direto, profundo e aplicável.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUpVariants} className="flex gap-4 flex-wrap mb-[72px]">
          <motion.a
            href="#livros"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 flex items-center gap-2 hover:bg-white/85 transition-colors"
          >
            Ver Ebooks <IconArrowRight />
          </motion.a>
          <motion.a
            href="#sobre"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="border border-white/25 text-white font-sans text-[13px] font-light tracking-[0.1em] uppercase px-7 py-3.5 hover:border-white/60 hover:bg-white/[0.04] transition-[border-color,background]"
          >
            Saiba mais
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerContainer} className="flex gap-10 flex-wrap">
          {displayStats.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUpVariants} className="border-l border-white/[0.14] pl-6">
              <p className="[font-family:'Playfair_Display',serif] text-[28px] font-bold">{value}</p>
              <p className="font-sans text-[12px] tracking-[0.15em] uppercase text-white/30 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Decorative letter */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="[font-family:'Playfair_Display',serif] font-black select-none pointer-events-none absolute right-[-10px] bottom-[-20px] text-white/[0.04] leading-[0.85] tracking-[-0.05em]"
        style={{ fontSize: "clamp(140px,22vw,280px)" }}
      >
        F
      </motion.span>
    </section>
  );
}
