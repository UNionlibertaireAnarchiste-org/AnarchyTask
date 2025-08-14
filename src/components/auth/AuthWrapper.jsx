import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import UserProfile from './UserProfile';

const AuthWrapper = ({ children }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-state">
        <p>⏳ Chargement de votre identité anarchiste...</p>
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher l'app principale
  if (user) {
    return (
      <>
        <UserProfile />
        {children}
      </>
    );
  }

  // Sinon, afficher les formulaires d'authentification
  return (
    <>
      {authMode === 'login' ? (
        <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
      )}
    </>
  );
};

export default AuthWrapper;