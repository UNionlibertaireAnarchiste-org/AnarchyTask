import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Button from '../button/Button';
import Input from '../input/Input';
import styles from './auth.module.css';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Effacer l'erreur quand l'utilisateur tape
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      return 'Le nom d\'utilisateur est requis';
    }
    
    if (formData.username.length < 3) {
      return 'Le nom d\'utilisateur doit faire au moins 3 caractères';
    }

    if (!formData.email.trim()) {
      return 'L\'email est requis';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Format d\'email invalide';
    }

    if (!formData.password) {
      return 'Le mot de passe est requis';
    }

    if (formData.password.length < 6) {
      return 'Le mot de passe doit faire au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Les mots de passe ne correspondent pas';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await register(
        formData.username.trim(),
        formData.email.trim(),
        formData.password
      );
      
      if (!result.success) {
        setError(result.error || 'Erreur lors de la création du compte');
      }
      // Si succès, l'AuthContext gère la redirection
    } catch (err) {
      setError('Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2>✊ Rejoindre la Révolution</h2>
          <p>Créez votre compte anarchiste</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Nom d'utilisateur</label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Votre nom de révolutionnaire..."
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email-rebelle.com"
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Mot de passe</label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Votre code secret (min. 6 caractères)..."
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Répétez votre code secret..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <p>⚠️ {error}</p>
            </div>
          )}

          <div className={styles.authActions}>
            <Button
              type="submit"
              text={isLoading ? "⏳ CRÉATION..." : "🔥 CRÉER MON COMPTE"}
              color="#dc3545"
              disabled={isLoading}
            />
          </div>
        </form>

        <div className={styles.authFooter}>
          <p>Déjà membre de la résistance ?</p>
          <button 
            className={styles.linkButton}
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            🏴‍☠️ Se connecter
          </button>
        </div>

        <div className={styles.anarchistQuote}>
          <small>« Ensemble, nous sommes plus forts que leurs systèmes »</small>
        </div>

        <div className={styles.privacyNote}>
          <p>🔒 Vos données restent sur votre appareil</p>
          <p>Aucun serveur central • Aucune surveillance</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;