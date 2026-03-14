import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState } from "react";
import App from "../App";
import { BookPage } from "../pages/BookPage";
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
        path: "/",
        element: <App />,
      },
      {
        path: "/home",
        element: <App />,
      },
      {
        path: "/livros",
        element: <App />,
      },
      {
        path: "/sobre",
        element: <App />,
      },
      {
        path: "/contato",
        element: <App />,
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
        path: "/ebook/:bookId",
        element: <BookPage />,
      },
      {
        path: "/video-promotion",
        element: <VideoPromotionPage />,
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
        path: "/unsubscribe",
        element: <UnsubscribePage />,
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
