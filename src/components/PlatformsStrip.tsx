// src/components/PlatformsStrip.tsx
import { motion } from "framer-motion";
import { IconTiktok, IconInstagram, IconWhatsapp, IconArrowUpRight } from "./Icons";
import { staggerContainer } from "../motionVariants";

interface Platform {
  id: number;
  name: string;
  handle: string;
  icon: React.ElementType;
  link: string;
  color: string;
}

const PLATFORMS: Platform[] = [
  {
    id: 1,
    name: "TikTok",
    handle: "@modus.focus",
    icon: IconTiktok,
    link: "https://www.tiktok.com/@modus_focus",
    color: "group-hover:text-[#ff0050]"
  },
  {
    id: 2,
    name: "Instagram",
    handle: "@modus.focus",
    icon: IconInstagram,
    link: "https://www.instagram.com/modus_focus_",
    color: "group-hover:text-[#E1306C]"
  },
  {
    id: 3,
    name: "WhatsApp",
    handle: "Comunidade",
    icon: IconWhatsapp,
    link: "https://chat.whatsapp.com/D5araq1cWrS18jcaon0fnX",
    color: "group-hover:text-[#25D366]"
  }
];

export function PlatformsStrip() {
  return (
    <section className="py-12 overflow-hidden bg-black ">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-[1400px] mx-auto"
      >
        <div className="relative">
          <div className="flex gap-8 animate-scroll-platforms">
            {[...PLATFORMS, ...PLATFORMS, ...PLATFORMS, ...PLATFORMS].map((p, idx) => (
              <a
                key={`${p.id}-${idx}`}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group min-w-[280px] flex items-center justify-between p-6 bg-transparent border border-transparent hover:border-white/10 transition-all duration-300 rounded-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-white/5 rounded-sm transition-colors duration-300 ${p.color}`}>
                    <p.icon size={20} />
                  </div>
                  <div>
                    <h5 className="text-[12px] font-bold text-white/90 uppercase tracking-wider">{p.name}</h5>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.1em]">{p.handle}</p>
                  </div>
                </div>
                
                <IconArrowUpRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
