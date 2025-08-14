import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Button from '../button/Button';
import TeamsManager from '../teams/TeamsManager';
import ProfileEditor from './ProfileEditor';
import styles from './profile.module.css';

const UserProfile = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const { user, logout, deleteAccount } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'Pour supprimer votre compte, tapez "SUPPRIMER" (en majuscules):'
    );
    
    if (confirmation === 'SUPPRIMER') {
      const result = await deleteAccount();
      if (result.success) {
        alert('Votre compte a été supprimé. Vive la révolution !');
      } else {
        alert('Erreur lors de la suppression: ' + result.error);
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <button 
            className={styles.profileButton}
            onClick={() => setShowProfile(!showProfile)}
          >
            <span className={styles.avatar}>{user.profile?.avatar || '🏴‍☠️'}</span>
            <span className={styles.username}>{user.profile?.displayName || user.username}</span>
            <span className={styles.arrow}>{showProfile ? '▲' : '▼'}</span>
          </button>
        </div>

        {showProfile && (
        <div className={styles.profileDropdown}>
          <div className={styles.profileInfo}>
            <div className={styles.userDetails}>
              <h3>{user.profile?.displayName || user.username}</h3>
              <p className={styles.email}>{user.email}</p>
              <p className={styles.bio}>{user.profile?.bio || 'Révolutionnaire numérique'}</p>
              <p className={styles.joinDate}>
                Membre depuis: {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className={styles.profileActions}>
            <Button
              text="✏️ Modifier Profil"
              color="#666"
              onClick={() => {
                setShowProfileEditor(true);
                setShowProfile(false);
              }}
            />
            
            <Button
              text="👥 Mes Équipes"
              color="#666"
              onClick={() => {
                setShowTeams(true);
                setShowProfile(false);
              }}
            />
            
            <Button
              text="🚪 Déconnexion"
              color="#8b0000"
              onClick={handleLogout}
            />
            
            <Button
              text="💥 Supprimer Compte"
              color="#dc3545"
              onClick={handleDeleteAccount}
            />
          </div>

          <div className={styles.profileFooter}>
            <small>« L'union fait la force, l'égalité fait l'union »</small>
          </div>
        </div>
      )}
    </div>

    {showTeams && (
      <TeamsManager onClose={() => setShowTeams(false)} />
    )}

    {showProfileEditor && (
      <ProfileEditor onClose={() => setShowProfileEditor(false)} />
    )}
  </>
  );
};

export default UserProfile;