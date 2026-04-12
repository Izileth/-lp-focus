import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState } from "react";
import App from "../App";
import { HomePage } from "../pages/HomePage";
import { BookPage } from "../pages/BookPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { CheckoutDirectPage } from "../pages/CheckoutExtraPage";
import { LandingPage } from "../pages/LandingPage";
import { VideoPromotionPage } from "../pages/VideoPromotionPage";
import { AdminPage } from "../pages/AdminPage";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";
import { CategoryPage } from "../pages/CategoryPage";
import UnsubscribePage from "../pages/UnsubscribePage";
import TermsPage from "../pages/TermsPage";
import PrivacyPage from "../pages/PrivacyPage";
import ContactPage from "../pages/ContactPage";
import ArticlesPage from "../pages/ArticlesPage";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import SplashScreen from "../components/SplashScreen";
import ScrollToTop from "../components/ScrollToTop";

function SplashLayout() {

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return sessionStorage.getItem("splash_shown") !== "true";
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem("splash_shown", "true");
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <SplashLayout />,
    children: [
      {
        element: <App />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/home",
            element: <HomePage />,
          },
          {
            path: "/livros",
            element: <HomePage />,
          },
          {
            path: "/metodo",
            element: <HomePage />,
          },
          {
            path: "/sobre",
            element: <HomePage />,
          },
          {
            path: "/contato",
            element: <HomePage />,
          },
          {
            path: "/artigos",
            element: <ArticlesPage />,
          },
          {
            path: "/artigo/:slug",
            element: <ArticleDetailPage />,
          },
          {
            path: "/lp/:section/:source?/:campaign?/:adgroup?/:ad?",
            element: <LandingPage />,
          },
          {
            path: "/livros/:slug",
            element: <BookPage />,
          },
          {
            path: "/checkout/:slug?",
            element: <CheckoutPage />,
          },
            {
            path: "/checkout/direct",
            element: <CheckoutDirectPage />,
          },
          {
            path: "/categoria/:categorySlug",
            element: <CategoryPage />,
          },
          {
            path: "/admin",
            element: <AdminPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/termos",
            element: <TermsPage />,
          },
          {
            path: "/privacidade",
            element: <PrivacyPage />,
          },
          {
            path: "/suporte",
            element: <ContactPage />,
          },
        ],
      },
      {
        path: "/unsubscribe",
        element: <UnsubscribePage />,
      },
      {
        path: "/video-promotion",
        element: <VideoPromotionPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
