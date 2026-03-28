import { motion, AnimatePresence } from "framer-motion";
import { IconBookOpen, IconTrendingUp, IconUser, IconSettings } from "../Icons";
import { AdminStatCard } from "./AdminStatCard";
import { stagger, fadeUp } from "./AdminVariants";
import type { AdminStats } from "../../types";

interface AdminHeaderProps {
  stats: AdminStats | null;
  statsLoading: boolean;
  isFormView: boolean;
}

export function AdminHeader({ stats, statsLoading, isFormView }: AdminHeaderProps) {
  return (
    <motion.header
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="mb-14"
    >
      <motion.div variants={fadeUp} className="flex flex-col gap-3 mb-8">
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3">
          Painel administrativo
        </span>
        <h1
          className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "clamp(28px,4.5vw,52px)" }}
        >
          Gerencie seu
          <br />
          <em className="not-italic text-white/60">catálogo.</em>
        </h1>
      </motion.div>

      <AnimatePresence>
        {!isFormView && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0,  height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <AdminStatCard 
                icon={<IconBookOpen size={18} />} 
                label="Produtos" 
                value={statsLoading ? "..." : (stats?.products_count?.toString() ?? "0")} 
              />
              <AdminStatCard 
                icon={<IconTrendingUp size={18} />} 
                label="Acessos" 
                value={statsLoading ? "..." : (stats?.visits_count?.toString() ?? "0")} 
              />
              <AdminStatCard 
                icon={<IconUser size={18} />} 
                label="Usuários" 
                value={statsLoading ? "..." : (stats?.users_count?.toString() ?? "0")} 
              />
              <AdminStatCard 
                icon={<IconBookOpen size={18} />} 
                label="Artigos" 
                value={statsLoading ? "..." : (stats?.articles_count?.toString() ?? "0")} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
