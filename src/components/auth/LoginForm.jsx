import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Button from '../button/Button';
import Input from '../input/Input';
import styles from './auth.module.css';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Effacer l'erreur quand l'utilisateur tape
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password) {
      setError('Tous les champs sont requis');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username.trim(), formData.password);
      
      if (!result.success) {
        setError(result.error || 'Erreur de connexion');
      }
      // Si succès, l'AuthContext gère la redirection
    } catch (err) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2>🏴‍☠️ Connexion Anarchiste</h2>
          <p>Rejoignez la révolution numérique</p>
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
            <label htmlFor="password">Mot de passe</label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Votre code secret..."
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
              text={isLoading ? "⏳ CONNEXION..." : "🔥 SE CONNECTER"}
              color="#dc3545"
              disabled={isLoading}
            />
          </div>
        </form>

        <div className={styles.authFooter}>
          <p>Pas encore de compte révolutionnaire ?</p>
          <button 
            className={styles.linkButton}
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            ✊ Rejoindre la résistance
          </button>
        </div>

        <div className={styles.anarchistQuote}>
          <small>« La liberté commence par l'autonomie numérique »</small>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;