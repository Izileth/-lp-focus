import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { SocialProofCarousel } from "../components/SocialProofCarousel";
import { PlatformsStrip } from "../components/PlatformsStrip";
import { FeaturesStrip } from "../components/FeaturesStrip";
import { BooksSection } from "../components/BooksSection";
import {
  MethodEPSDPSection,
  MethodDiagnosisSection,
  MethodTriadeSection
} from "../components/MethodSection";
import { AboutSection } from "../components/AboutSection";
import { ContactSection } from "../components/ContactSection";
import { CtaSection } from "../components/CtaSection";

export function HomePage() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pathToId: Record<string, string> = {
      "/livros": "livros",
      "/sobre": "sobre",
      "/contato": "contato",
      "/metodo": "metodo",
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
    <main>
      <HeroSection />
      <PlatformsStrip />
      <MethodEPSDPSection />
      <FeaturesStrip />
      <BooksSection />
      <SocialProofCarousel />
      <MethodDiagnosisSection />
      <AboutSection />
      <MethodTriadeSection />
      <ContactSection />
      <CtaSection />
    </main>
  );
}
