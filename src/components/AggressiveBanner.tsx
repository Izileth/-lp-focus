import { motion } from "framer-motion";

interface AggressiveBannerProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export function AggressiveBanner({
  imageUrl = "https://wnotjxleeltjysdlplkc.supabase.co/storage/v1/object/public/article-images/covers/1775160158631-l0syyb.png",
}: AggressiveBannerProps) {
  return (
    <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={imageUrl}
          alt="Banner Background"
          className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-emerald-500/0 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-emerald-500/0 to-transparent" />
    
      {/* Large Decorative Text Background */}
      <div className="absolute bottom-[-10%] [font-family:'Playfair_Display',serif] font-black right-[-5%] pointer-events-none select-none">
        <span className="text-[20vw] font-black text-white/[0.03] leading-none uppercase">
          FOCUS
        </span>
      </div>
    </section>
  );
}
