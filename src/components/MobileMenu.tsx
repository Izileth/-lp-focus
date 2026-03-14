// src/components/MobileMenu.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { slideIn, staggerContainer, fadeUpVariants } from "../motionVariants";
import { NAV_LINKS } from "../constants";
import { IconX, IconArrowRight, IconUser } from "./Icons";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAdmin } from "../hooks/useAdmin";

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function MobileMenu({ menuOpen, setMenuOpen }: MobileMenuProps) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const getInitial = () => {
    if (profile?.name) return profile.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return <IconUser size={18} />;
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="mobile-menu"
          variants={slideIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center gap-10"
        >
          <button
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
          >
            <IconX />
          </button>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-8"
          >
            {user && (
              <motion.div variants={fadeUpVariants} className="flex flex-col items-center gap-4 mb-4">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xl font-bold text-white/80 no-underline"
                >
                  {getInitial()}
                </Link>
                <div className="flex flex-col items-center">
                  <span className="text-white/40 text-[11px] uppercase tracking-[0.2em]">
                    {profile?.name || user.email}
                  </span>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setMenuOpen(false)}
                      className="text-emerald-400 text-[9px] uppercase tracking-[0.2em] font-bold mt-1 no-underline"
                    >
                      Painel Admin
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

            {NAV_LINKS.map((item) => (
              <motion.div key={item} variants={fadeUpVariants}>
                <Link
                  to={item === "Ebooks" ? "/livros" : `/${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="[font-family:'Playfair_Display',serif] text-4xl text-white/60 no-underline hover:text-white transition-colors duration-200 block"
                >
                  {item}
                </Link>
              </motion.div>
            ))}

            {!user ? (
              <motion.div variants={fadeUpVariants}>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 flex items-center gap-2 hover:bg-white/85 transition-colors no-underline"
                >
                  Acessar Conta <IconArrowRight size={14} />
                </Link>
              </motion.div>
            ) : (
              <motion.div variants={fadeUpVariants}>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 border border-white/10 text-white font-sans text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 flex items-center gap-2 hover:bg-white/5 transition-colors no-underline"
                >
                  Meu Perfil <IconArrowRight size={14} />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
