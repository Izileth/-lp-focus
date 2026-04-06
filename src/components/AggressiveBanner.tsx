import { motion } from "framer-motion";
import { IconArrowRight } from "./Icons";

interface AggressiveBannerProps {
  url: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export function AggressiveBanner({
  url,
  imageUrl = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
  title = "DOMINE SUA MENTE",
  subtitle = "O CONHECIMENTO É A ÚNICA ARMA QUE VOCÊ PRECISA",
  ctaText = "QUERO COMEÇAR AGORA"
}: AggressiveBannerProps) {
  return (
    <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={imageUrl}
          alt="Banner Background"
          className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-10 flex flex-col justify-center items-start">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block px-3 py-1 bg-emerald-500 text-black text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            Acesso Exclusivo
          </span>
          
          <h2 className="[font-family:'Playfair_Display',serif] text-5xl md:text-8xl font-black italic text-white leading-[0.9] tracking-tighter mb-6">
            {title.split(' ').map((word, i) => (
              <span key={i} className="block">
                {word}
              </span>
            ))}
          </h2>

          <p className="font-sans text-sm md:text-lg text-white/50 tracking-[0.1em] uppercase mb-10 max-w-md font-light">
            {subtitle}
          </p>

          <motion.a
            href={url}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 font-black text-sm tracking-[0.2em] uppercase hover:bg-emerald-500 hover:text-white transition-all duration-300"
          >
            {ctaText}
            <IconArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
            
            {/* Corner Borders */}
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </motion.a>
        </motion.div>
      </div>

      {/* Large Decorative Text Background */}
      <div className="absolute bottom-[-10%] right-[-5%] pointer-events-none select-none">
        <span className="text-[20vw] font-black text-white/[0.03] leading-none uppercase italic">
          FOCUS
        </span>
      </div>
    </section>
  );
}
