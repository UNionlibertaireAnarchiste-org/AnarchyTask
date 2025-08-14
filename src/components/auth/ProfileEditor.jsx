import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Button from '../button/Button';
import Input from '../input/Input';
import styles from './profileEditor.module.css';

const ProfileEditor = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    displayName: user.profile?.displayName || user.username,
    bio: user.profile?.bio || '',
    avatar: user.profile?.avatar || '🏴‍☠️'
  });

  const avatarOptions = [
    '🏴‍☠️', '✊', '🔥', '⚡', '🌍', '💥', '🚀', '🎯', 
    '🛡️', '⚔️', '🏹', '🗡️', '🔱', '⭐', '💎', '🎭',
    '🦅', '🐺', '🦁', '🐉', '🌙', '☀️', '🌟', '💫'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({
      ...prev,
      avatar
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.displayName.trim()) {
      setError('Le nom d\'affichage est requis');
      return;
    }

    if (formData.displayName.length < 2) {
      setError('Le nom d\'affichage doit faire au moins 2 caractères');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const updates = {
        profile: {
          ...user.profile,
          displayName: formData.displayName.trim(),
          bio: formData.bio.trim(),
          avatar: formData.avatar
        }
      };

      const result = await updateProfile(updates);
      
      if (result.success) {
        setSuccess('Profil mis à jour avec succès !');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileEditorOverlay}>
      <div className={styles.profileEditorModal}>
        <div className={styles.profileEditorHeader}>
          <h2>✏️ Modifier mon Profil Anarchiste</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.profileEditorContent}>
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            {/* Avatar */}
            <div className={styles.inputGroup}>
              <label>Avatar Révolutionnaire</label>
              <div className={styles.currentAvatar}>
                <span className={styles.avatarDisplay}>{formData.avatar}</span>
                <span>Avatar actuel</span>
              </div>
              <div className={styles.avatarGrid}>
                {avatarOptions.map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    className={`${styles.avatarOption} ${formData.avatar === avatar ? styles.selected : ''}`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Nom d'affichage */}
            <div className={styles.inputGroup}>
              <label htmlFor="displayName">Nom d'affichage</label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Votre nom de révolutionnaire..."
                disabled={loading}
              />
            </div>

            {/* Bio */}
            <div className={styles.inputGroup}>
              <label htmlFor="bio">Bio Anarchiste</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Décrivez votre mission révolutionnaire..."
                disabled={loading}
                className={styles.textarea}
                rows="4"
                maxLength="200"
              />
              <small className={styles.charCount}>
                {formData.bio.length}/200 caractères
              </small>
            </div>

            {/* Messages */}
            {error && (
              <div className={styles.errorMessage}>
                <p>⚠️ {error}</p>
              </div>
            )}

            {success && (
              <div className={styles.successMessage}>
                <p>✅ {success}</p>
              </div>
            )}

            {/* Actions */}
            <div className={styles.profileActions}>
              <Button
                type="submit"
                text={loading ? "⏳ MISE À JOUR..." : "🔥 SAUVEGARDER"}
                color="#dc3545"
                disabled={loading}
              />
              <Button
                type="button"
                text="🚫 ANNULER"
                color="#666"
                onClick={onClose}
                disabled={loading}
              />
            </div>
          </form>

          {/* Informations du compte */}
          <div className={styles.accountInfo}>
            <h3>📊 Informations du Compte</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nom d'utilisateur:</span>
                <span className={styles.infoValue}>{user.username}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Membre depuis:</span>
                <span className={styles.infoValue}>
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Dernière connexion:</span>
                <span className={styles.infoValue}>
                  {new Date(user.updatedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.anarchistQuote}>
            <small>« Sois toi-même, tous les autres sont déjà pris » - Oscar Wilde</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;