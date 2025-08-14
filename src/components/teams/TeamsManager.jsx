import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { TeamsDB } from '../../teams/teamsDB';
import Button from '../button/Button';
import Input from '../input/Input';
import TeamTasks from './TeamTasks';
import styles from './teams.module.css';

const TeamsManager = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('myTeams'); // 'myTeams' | 'create' | 'join'
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  // Formulaire création d'équipe
  const [createForm, setCreateForm] = useState({
    name: '',
    description: ''
  });
  
  // Formulaire rejoindre équipe
  const [joinCode, setJoinCode] = useState('');
  
  const { user } = useAuth();

  // Charger les équipes de l'utilisateur
  useEffect(() => {
    if (user && activeTab === 'myTeams') {
      loadUserTeams();
    }
  }, [user, activeTab]);

  const loadUserTeams = async () => {
    try {
      setLoading(true);
      const userTeams = await TeamsDB.getUserTeams(user.id);
      setTeams(userTeams);
    } catch (err) {
      setError('Erreur lors du chargement des équipes');
      console.error('Erreur loadUserTeams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    
    if (!createForm.name.trim()) {
      setError('Le nom de l\'équipe est requis');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const newTeam = await TeamsDB.createTeam(
        createForm.name,
        createForm.description,
        user.id
      );
      
      setCreateForm({ name: '', description: '' });
      setActiveTab('myTeams');
      await loadUserTeams();
      
      alert(`Équipe "${newTeam.name}" créée ! Code: ${newTeam.code}`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      setError('Le code d\'équipe est requis');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await TeamsDB.joinTeam(joinCode.trim().toUpperCase(), user.id);
      
      setJoinCode('');
      setActiveTab('myTeams');
      await loadUserTeams();
      
      alert(`Vous avez rejoint l'équipe "${result.team.name}" !`);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'adhésion à l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className={styles.teamsOverlay}>
      <div className={styles.teamsModal}>
        <div className={styles.teamsHeader}>
          <h2>👥 Équipes Anarchistes</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.teamsTabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'myTeams' ? styles.active : ''}`}
            onClick={() => setActiveTab('myTeams')}
          >
            Mes Équipes
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'create' ? styles.active : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Créer
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'join' ? styles.active : ''}`}
            onClick={() => setActiveTab('join')}
          >
            Rejoindre
          </button>
        </div>

        <div className={styles.teamsContent}>
          {error && (
            <div className={styles.errorMessage}>
              <p>⚠️ {error}</p>
            </div>
          )}

          {activeTab === 'myTeams' && (
            <div className={styles.myTeams}>
              {loading ? (
                <p>⏳ Chargement de vos équipes...</p>
              ) : teams.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>🏴‍☠️ Aucune équipe pour le moment</p>
                  <p>Créez votre première équipe ou rejoignez-en une !</p>
                </div>
              ) : (
                <div className={styles.teamsList}>
                  {teams.map(team => (
                    <div key={team.id} className={styles.teamCard}>
                      <div className={styles.teamInfo}>
                        <h3>{team.name}</h3>
                        <p>{team.description || 'Aucune description'}</p>
                        <div className={styles.teamMeta}>
                          <span className={styles.teamCode}>Code: {team.code}</span>
                          <span className={styles.teamRole}>
                            {team.membership.role === 'fondateur' ? '🏴‍☠️ Fondateur' : '✊ Camarade'}
                          </span>
                        </div>
                      </div>
                      <div className={styles.teamActions}>
                        <Button
                          text="📋 Voir Tâches"
                          color="#666"
                          onClick={() => setSelectedTeam(team)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className={styles.createTeam}>
              <form onSubmit={handleCreateTeam}>
                <div className={styles.inputGroup}>
                  <label htmlFor="teamName">Nom de l'équipe</label>
                  <Input
                    id="teamName"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateFormChange}
                    placeholder="Les Révolutionnaires du Code..."
                    disabled={loading}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="teamDescription">Description (optionnelle)</label>
                  <textarea
                    id="teamDescription"
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateFormChange}
                    placeholder="Notre mission anarchiste..."
                    disabled={loading}
                    className={styles.textarea}
                    rows="3"
                  />
                </div>

                <Button
                  type="submit"
                  text={loading ? "⏳ CRÉATION..." : "🔥 CRÉER L'ÉQUIPE"}
                  color="#dc3545"
                  disabled={loading}
                />
              </form>

              <div className={styles.createInfo}>
                <h4>🏴‍☠️ Principes des Équipes Anarchistes</h4>
                <ul>
                  <li>✊ Collaboration horizontale entre camarades égaux</li>
                  <li>🔒 Données stockées localement sur chaque appareil</li>
                  <li>🌍 Partage décentralisé entre camarades</li>
                  <li>🔄 Auto-organisation collective sans chef</li>
                  <li>⚖️ Fondateur = facilitateur, pas dirigeant</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'join' && (
            <div className={styles.joinTeam}>
              <form onSubmit={handleJoinTeam}>
                <div className={styles.inputGroup}>
                  <label htmlFor="joinCode">Code d'équipe</label>
                  <Input
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="ABC123"
                    disabled={loading}
                    style={{ textTransform: 'uppercase', letterSpacing: '2px' }}
                  />
                </div>

                <Button
                  type="submit"
                  text={loading ? "⏳ ADHÉSION..." : "✊ REJOINDRE L'ÉQUIPE"}
                  color="#dc3545"
                  disabled={loading}
                />
              </form>

              <div className={styles.joinInfo}>
                <h4>🤝 Comment rejoindre une équipe anarchiste ?</h4>
                <ol>
                  <li>Demandez le code à un camarade de l'équipe</li>
                  <li>Saisissez le code ci-dessus (6 caractères)</li>
                  <li>Cliquez sur "Rejoindre l'équipe"</li>
                  <li>Vous devenez camarade avec droits égaux !</li>
                </ol>
                
                <div className={styles.privacyNote}>
                  <p>🔒 Vos données restent sur votre appareil</p>
                  <p>Collaboration décentralisée entre égaux</p>
                  <p>⚖️ Aucune hiérarchie, que de la solidarité</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTeam && (
        <TeamTasks 
          team={selectedTeam} 
          onClose={() => setSelectedTeam(null)} 
        />
      )}
    </div>
  );
};

export default TeamsManager;