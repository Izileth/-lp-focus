// src/pages/LoginPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { LoadingState } from '../components/ui/StatesScreens';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authInitialLoading } = useAuth(); // Renamed to avoid confusion
  const { isAdmin, loading: adminInitialLoading } = useAdmin(); // Renamed to avoid confusion

  // This useEffect handles redirection *after* authentication status is known
  useEffect(() => {
    // Only proceed if both auth and admin status have completed their initial checks
    if (!authInitialLoading && !adminInitialLoading) {
      if (user) { // User is authenticated
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    }
  }, [user, authInitialLoading, isAdmin, adminInitialLoading, navigate]);

  // If initial authentication status is loading, wait before rendering the form.
  if (authInitialLoading) {
    return <LoadingState message="Verificando autenticação..." />;
  }

  // If authInitialLoading is false and a user exists, and admin status is still loading,
  // show a specific loading message for admin status.
  if (user && adminInitialLoading) {
    return <LoadingState message="Verificando permissões de administrador..." />;
  }

  // In all other cases (no user, or user exists and all statuses loaded), render the AuthForm.
  // Redirection is handled by useEffect.
  return (
    <AuthForm onSuccess={() => { }} />
  );
}
