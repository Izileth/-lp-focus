import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { SocialProofCarousel } from "../components/SocialProofCarousel";
import { PlatformsStrip } from "../components/PlatformsStrip";
import { FeaturesStrip } from "../components/FeaturesStrip";
import { BooksSection } from "../components/BooksSection";
import {
  MethodEPSDPSection,
} from "../components/MethodSection";
import { AboutSection } from "../components/AboutSection";
import { QuizSection } from "../components/QuizSection";
import { CtaSection } from "../components/CtaSection";
import { SocialFanBadge } from "../components/FlanSocialBadges";
import { HonorableMentionsSection } from "../components/HonorableMentions";
import { AggressiveBanner } from "../components/AggressiveBanner";

export function HomePage() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pathToId: Record<string, string> = {
      "/livros": "livros",
      "/sobre": "sobre",
      "/contato": "contato",
      "/metodo": "metodo",
      "/quiz": "quiz",
      "/hall": "hall",
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
      <HonorableMentionsSection />
      <SocialProofCarousel />
      <QuizSection />
      <AboutSection />
      <CtaSection />
      <AggressiveBanner url="/livros" />
      <SocialFanBadge />
    </main>
  );
}
