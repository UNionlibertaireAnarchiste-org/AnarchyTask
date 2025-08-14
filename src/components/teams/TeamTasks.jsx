import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { TeamsDB } from '../../teams/teamsDB';
import Button from '../button/Button';
import Input from '../input/Input';
import Card from '../card/Card';
import styles from './teamTasks.module.css';

const TeamTasks = ({ team, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();

  // Charger les tâches de l'équipe
  useEffect(() => {
    loadTeamTasks();
  }, [team.id]);

  const loadTeamTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const teamTasks = await TeamsDB.getTeamTasks(team.id);
      setTasks(teamTasks);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      console.error('Erreur loadTeamTasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    try {
      setError('');
      const newTask = await TeamsDB.createSharedTask(
        team.id,
        inputValue.trim(),
        user.id
      );
      
      if (newTask) {
        setTasks(prev => [newTask, ...prev]);
        setInputValue('');
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout de la tâche');
      console.error('Erreur addTask:', err);
    }
  };

  const handleUpdateTask = async (taskId, newText) => {
    try {
      const success = await TeamsDB.updateSharedTask(taskId, newText);
      if (success) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, text: newText, updatedAt: new Date().toISOString() } : task
        ));
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour');
      console.error('Erreur updateTask:', err);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const success = await TeamsDB.updateSharedTask(taskId, task.text, !task.completed);
      if (success) {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
        ));
      }
    } catch (err) {
      setError('Erreur lors du changement de statut');
      console.error('Erreur toggleTask:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Supprimer cette tâche partagée ?')) return;

    try {
      const success = await TeamsDB.deleteSharedTask(taskId);
      if (success) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur deleteTask:', err);
    }
  };

  // Filtrer les tâches
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    
    return tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filter === 'all' || 
        (filter === 'completed' && task.completed) || 
        (filter === 'pending' && !task.completed);
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchTerm, filter]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    if (!Array.isArray(tasks)) return { total: 0, pending: 0, completed: 0 };
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, pending, completed };
  }, [tasks]);

  const { total: totalTasks, pending: pendingCount, completed: completedCount } = stats;

  return (
    <div className={styles.teamTasksOverlay}>
      <div className={styles.teamTasksModal}>
        <div className={styles.teamTasksHeader}>
          <div className={styles.teamInfo}>
            <h2>📋 {team.name}</h2>
            <p>{team.description || 'Tâches partagées de l\'équipe'}</p>
            <span className={styles.teamCode}>Code: {team.code}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.teamTasksContent}>
          {/* Formulaire d'ajout */}
          <form onSubmit={handleAddTask} className={styles.addTaskForm}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ajouter une tâche partagée..."
              disabled={loading}
            />
            <Button
              type="submit"
              text={loading ? "⏳" : "🔥 AJOUTER"}
              color="#dc3545"
              disabled={loading || !inputValue.trim()}
            />
          </form>

          {/* Contrôles */}
          <div className={styles.controls}>
            <div className={styles.searchContainer}>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans les tâches partagées..."
              />
            </div>
            
            <div className={styles.filterButtons}>
              <Button
                text={`🌍 Toutes (${totalTasks})`}
                color={filter === 'all' ? '#dc3545' : '#666'}
                onClick={() => setFilter('all')}
              />
              <Button
                text={`🔄 En cours (${pendingCount})`}
                color={filter === 'pending' ? '#ff6b35' : '#666'}
                onClick={() => setFilter('pending')}
              />
              <Button
                text={`✊ Terminées (${completedCount})`}
                color={filter === 'completed' ? '#2d5016' : '#666'}
                onClick={() => setFilter('completed')}
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <p>⚠️ {error}</p>
            </div>
          )}

          {/* Liste des tâches */}
          <div className={styles.tasksList}>
            {loading ? (
              <div className={styles.loadingState}>
                <p>⏳ Chargement des tâches partagées...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  {searchTerm ? '🔍 Aucune tâche trouvée...' : 
                   filter === 'completed' ? '✊ Aucune tâche terminée...' :
                   filter === 'pending' ? '🔄 Aucune tâche en cours...' :
                   '🏴‍☠️ Aucune tâche partagée. Commencez la collaboration !'}
                </p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className={styles.sharedTaskCard}>
                  <Card
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onToggle={handleToggleTask}
                  />
                  <div className={styles.taskMeta}>
                    <span className={styles.taskAuthor}>
                      Par: {task.createdBy === user.id ? 'Vous' : `Utilisateur ${task.createdBy}`}
                    </span>
                    <span className={styles.taskDate}>
                      {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Statistiques */}
          <div className={styles.teamStats}>
            <p>👥 Équipe: {team.name} | 📋 Total: {totalTasks} | 🔄 En cours: {pendingCount} | ✊ Terminées: {completedCount}</p>
            <small>« La collaboration anarchiste en action »</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamTasks;