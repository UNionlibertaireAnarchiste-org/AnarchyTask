import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthDB } from './authDB.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      const currentUser = await AuthDB.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Erreur chargement utilisateur:', err);
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer un compte anarchiste
  const register = async (username, email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const newUser = await AuthDB.createUser(username, email, password);
      if (newUser) {
        setUser(newUser);
        return { success: true, user: newUser };
      }
      return { success: false, error: 'Échec de création du compte' };
    } catch (err) {
      const errorMsg = err.message || 'Erreur lors de la création du compte';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Connexion anarchiste
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const loggedUser = await AuthDB.loginUser(username, password);
      if (loggedUser) {
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      }
      return { success: false, error: 'Identifiants incorrects' };
    } catch (err) {
      const errorMsg = err.message || 'Erreur de connexion';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await AuthDB.logoutUser();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (updates) => {
    try {
      setError(null);
      const updatedUser = await AuthDB.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
      return { success: false, error: 'Échec de mise à jour' };
    } catch (err) {
      const errorMsg = err.message || 'Erreur de mise à jour';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Supprimer le compte
  const deleteAccount = async () => {
    try {
      setError(null);
      const success = await AuthDB.deleteUser(user.id);
      if (success) {
        setUser(null);
        return { success: true };
      }
      return { success: false, error: 'Échec de suppression' };
    } catch (err) {
      const errorMsg = err.message || 'Erreur de suppression';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;