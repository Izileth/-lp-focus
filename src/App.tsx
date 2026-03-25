import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { NoiseOverlay } from "./components/NoiseOverlay";
import { MobileMenu } from "./components/MobileMenu";
import { Header } from "./components/Header";
import { OfferCountdown } from "./components/OfferCountdown";
import { PersonalizedOfferBanner } from "./components/PersonalizedOfferBanner";
import { HeroSection } from "./components/HeroSection";
import { FeaturesStrip } from "./components/FeaturesStrip";
import { BooksSection } from "./components/BooksSection";
import { AboutSection } from "./components/AboutSection"; 
import { ContactSection } from "./components/ContactSection"; 
import { CtaSection } from "./components/CtaSection";
import NewsletterSection from "./components/NewsletterSection";
import { Footer } from "./components/Footer";

export default function App() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const pathToId: Record<string, string> = {
      "/livros": "livros",
      "/sobre": "sobre",
      "/contato": "contato",
    };

    const sectionId = pathToId[pathname];
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (pathname === "/" || pathname === "/home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap"
      />
      <div className="bg-black text-white min-h-screen overflow-x-hidden scroll-smooth">
        <NoiseOverlay />
        <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <OfferCountdown />
        <PersonalizedOfferBanner />
        <main>
          <HeroSection />
          <FeaturesStrip />
          <BooksSection />
          <AboutSection /> 
          <ContactSection />
          <NewsletterSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
