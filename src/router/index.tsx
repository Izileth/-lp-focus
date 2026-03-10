// src/router/index.tsx
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState } from "react";
import App from "../App";
import { BookPage } from "../pages/BookPage";
import { AdminPage } from "../pages/AdminPage";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";
import { CategoryPage } from "../pages/CategoryPage";
import UnsubscribePage from "../pages/UnsubscribePage";
import SplashScreen from "../components/SplashScreen";

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

  return <Outlet />;
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
        path: "/ebook/:bookId",
        element: <BookPage />,
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
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
