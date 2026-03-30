import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { NoiseOverlay } from "./components/NoiseOverlay";
import { MobileMenu } from "./components/MobileMenu";
import { Header } from "./components/Header";
import { TopOfferCarousel } from "./components/TopOfferBanner";
import { BottonOfferBanner } from "./components/BottonOfferBanner";
import NewsletterSection from "./components/NewsletterSection";
import { Footer } from "./components/Footer";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      const hasVisited = sessionStorage.getItem("visit_tracked");
      if (!hasVisited && supabase) {
        await supabase.rpc('track_site_visit');
        sessionStorage.setItem("visit_tracked", "true");
      }
    };
    trackVisit();
  }, []);

  const isNoLayoutPage = pathname.startsWith('/login') || pathname.startsWith('/admin') || pathname.startsWith('/profile');
  const isMinimalPage = pathname.startsWith('/suporte') || pathname.startsWith('/termos') || pathname.startsWith('/privacidade');

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
        
        {!isNoLayoutPage && !isMinimalPage && <TopOfferCarousel />}
        {!isNoLayoutPage && <BottonOfferBanner />}
        
        <Outlet />
        
        {!isNoLayoutPage && !isMinimalPage && <NewsletterSection />}
        {!isNoLayoutPage && <Footer />}
      </div>
    </>
  );
}
