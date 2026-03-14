// src/components/Header.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "../constants";
import { IconMenu, IconArrowRight, IconUser } from "./Icons";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAdmin } from "../hooks/useAdmin";
import Logo from '../../src/assets/favicons.png'

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const getInitial = () => {
    if (profile?.name) return profile.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return <IconUser size={14} />;
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={[
        "fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-10",
        "transition-[background,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-white/[0.08] bg-black/90 backdrop-blur-xl"
          : "border-b border-transparent",
      ].join(" ")}
    >
      {/* Logo */}
      <Link to="/" className="flex items-baseline gap-2 no-underline text-white">
        <span className="[font-family:'Playfair_Display',serif] text-xl font-bold tracking-[0.02em] flex items-center">
          F
          <img
            src={Logo}
            alt="Logo FOCUS"
            className="h-7 w-7 object-contain"
          />
          CUS
        </span>

        <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/30">
          | Conhecimento
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-10">
        {isAdmin && (
          <Link
            to="/admin"
            className="font-sans text-[11px] tracking-[0.15em] uppercase text-emerald-400/90 no-underline hover:text-emerald-300 transition-colors duration-200 border border-emerald-400/20 px-3 py-1.5 bg-emerald-400/5 rounded-sm"
          >
            Painel Admin
          </Link>
        )}
        {NAV_LINKS.map((item) => (
          <Link
            key={item}
            to={item === "Ebooks" ? "/livros" : `/${item.toLowerCase()}`}
            className="font-sans text-[13px] tracking-[0.12em] uppercase text-white/55 no-underline hover:text-white transition-colors duration-200"
          >
            {item}
          </Link>
        ))}

        {user ? (
          <Link
            to="/profile"
            className="flex items-center gap-3 group no-underline"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[11px] font-bold text-white/70 group-hover:border-white/30 group-hover:bg-white/10 transition-all">
              {getInitial()}
            </div>
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 flex items-center gap-2 hover:bg-white/85 transition-colors no-underline"
          >
            Acessar <IconArrowRight size={14} />
          </Link>
        )}
      </nav>

      {/* Hamburger */}
      <div className="flex items-center gap-4 md:hidden">
        {user && (
          <Link to="/profile" className="no-underline">
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[11px] font-bold text-white/70">
              {getInitial()}
            </div>
          </Link>
        )}
        <button
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="text-white bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
        >
          <IconMenu />
        </button>
      </div>
    </motion.header>
  );
}
