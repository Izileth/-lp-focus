// src/components/Header.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "../constants";
import { IconMenu, IconArrowRight, IconUser, IconShoppingCart } from "./Icons";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAdmin } from "../hooks/useAdmin";
import { useCart } from "../hooks/useCart";
import { CartDrawer } from "./CartDrawer";
import Logo from "../../public/icons/fabicon-orginal.png";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { isAdmin } = useAdmin();
  const { totalItems } = useCart();

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
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={[
          "fixed top-12 left-0 right-0 z-[100] h-16 px-6 md:px-10",
          "transition-[background,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-white/[0.08] bg-black/90 backdrop-blur-xl"
            : "border-b border-transparent",
        ].join(" ")}
      >
        {/* DESKTOP */}
        <div className="hidden md:flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-baseline gap-2 no-underline text-white">
            <span className="[font-family:'Playfair_Display',serif] text-xl font-bold">
              Modus
            </span>

            <span className="[font-family:'Playfair_Display',serif] text-xl font-bold flex items-center">
              F
              <img
                src={Logo}
                alt="Logo FOCUS"
                className="h-8 w-8 mx-[-0.3em] object-contain"
              />
              CUS
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-10">
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
                key={item.label}
                to={item.path}
                className="font-sans text-[13px] tracking-[0.12em] uppercase text-white/55 no-underline hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-white/55 hover:text-white transition-colors"
            >
              <IconShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <Link to="/profile" className="flex items-center gap-3 no-underline">
                <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[11px] font-bold text-white/70">
                  {getInitial()}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-white text-black text-[12px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 flex items-center gap-2 hover:bg-white/85 transition-colors no-underline"
              >
                Acessar <IconArrowRight size={14} />
              </Link>
            )}
          </nav>
        </div>

        {/* MOBILE */}
        <div className="md:hidden w-full grid grid-cols-3 items-center h-full">
          {/* LEFT - Cart */}
          <div className="flex justify-start">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-white/70"
            >
              <IconShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* CENTER - Logo */}
          <div className="flex justify-center">
            <Link to="/" className="flex items-center gap-1 no-underline text-white">
              <span className="[font-family:'Playfair_Display',serif] text-lg font-bold">
                Modus
              </span>

              <span className="[font-family:'Playfair_Display',serif] text-lg font-bold flex items-center">
                F
                <img
                  src={Logo}
                  alt="Logo FOCUS"
                  className="h-7 w-7 mx-[-0.25em] object-contain"
                />
                CUS
              </span>
            </Link>
          </div>

          {/* RIGHT - Menu */}
          <div className="flex justify-end items-center gap-3">
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
        </div>
      </motion.header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}