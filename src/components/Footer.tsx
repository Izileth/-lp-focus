import { Link } from "react-router-dom";
import { FOOT_LINKS } from "../constants";

export function Footer() {
  return (
    <footer className="px-10 py-12 border-t border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-6">
        <div className="flex items-baseline gap-2">
          <span className="[font-family:'Playfair_Display',serif] text-[18px] font-bold">FOCUS</span>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/25">| Conhecimento</span>
        </div>

        <p className="font-sans text-[11px] text-white/25 tracking-wide">
          © 2025 Focus Conhecimento. Todos os direitos reservados.
        </p>

        <nav className="flex gap-7">
          {FOOT_LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="font-sans text-[11px] tracking-[0.1em] uppercase text-white/30 no-underline hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
