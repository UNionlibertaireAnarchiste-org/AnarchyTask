import { useState, useEffect, useCallback } from 'react';
import { TaskDB } from '../database/indexedDB.js';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les tâches depuis la base de données
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dbTasks = await TaskDB.getAllTasks();
      setTasks(Array.isArray(dbTasks) ? dbTasks : []);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      console.error('Erreur loadTasks:', err);
      // Fallback vers localStorage
      try {
        const savedTasks = localStorage.getItem('anarchytasks_fallback');
        if (savedTasks) {
          const parsed = JSON.parse(savedTasks);
          setTasks(Array.isArray(parsed) ? parsed : []);
        } else {
          setTasks([]);
        }
      } catch (parseErr) {
        console.error('Erreur parsing localStorage:', parseErr);
        setTasks([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter une nouvelle tâche
  const addTask = useCallback(async (text) => {
    if (!text.trim()) return false;

    try {
      const newTask = await TaskDB.addTask(text.trim());
      if (newTask) {
        setTasks(prevTasks => {
          const updatedTasks = [newTask, ...prevTasks];
          // Backup dans localStorage
          localStorage.setItem('anarchytasks_fallback', JSON.stringify(updatedTasks));
          return updatedTasks;
        });
        return true;
      }
      return false;
    } catch (err) {
      setError('Erreur lors de l\'ajout de la tâche');
      console.error('Erreur addTask:', err);
      return false;
    }
  }, []);

  // Mettre à jour une tâche
  const updateTask = useCallback(async (id, newText) => {
    if (!newText.trim()) return false;

    try {
      setTasks(prevTasks => {
        const task = prevTasks.find(t => t.id === id);
        if (!task) return prevTasks;

        return prevTasks.map(t => 
          t.id === id ? { ...t, text: newText.trim() } : t
        );
      });

      const success = await TaskDB.updateTask(id, newText.trim(), false);
      if (success) {
        // Backup dans localStorage
        setTasks(prevTasks => {
          localStorage.setItem('anarchytasks_fallback', JSON.stringify(prevTasks));
          return prevTasks;
        });
        return true;
      }
      return false;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
      console.error('Erreur updateTask:', err);
      return false;
    }
  }, []);

  // Basculer le statut d'une tâche
  const toggleTask = useCallback(async (id) => {
    try {
      let taskToUpdate = null;
      
      setTasks(prevTasks => {
        const task = prevTasks.find(t => t.id === id);
        if (!task) return prevTasks;
        
        taskToUpdate = task;
        const newCompleted = !task.completed;
        
        return prevTasks.map(t => 
          t.id === id ? { ...t, completed: newCompleted } : t
        );
      });

      if (taskToUpdate) {
        const success = await TaskDB.updateTask(id, taskToUpdate.text, !taskToUpdate.completed);
        if (success) {
          // Backup dans localStorage
          setTasks(prevTasks => {
            localStorage.setItem('anarchytasks_fallback', JSON.stringify(prevTasks));
            return prevTasks;
          });
          return true;
        }
      }
      return false;
    } catch (err) {
      setError('Erreur lors du changement de statut');
      console.error('Erreur toggleTask:', err);
      return false;
    }
  }, []);

  // Supprimer une tâche
  const deleteTask = useCallback(async (id) => {
    try {
      const success = await TaskDB.deleteTask(id);
      if (success) {
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.filter(t => t.id !== id);
          // Backup dans localStorage
          localStorage.setItem('anarchytasks_fallback', JSON.stringify(updatedTasks));
          return updatedTasks;
        });
        return true;
      }
      return false;
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche');
      console.error('Erreur deleteTask:', err);
      return false;
    }
  }, []);

  // Supprimer toutes les tâches terminées
  const clearCompleted = useCallback(async () => {
    try {
      const deletedCount = await TaskDB.deleteCompletedTasks();
      if (deletedCount > 0) {
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.filter(t => !t.completed);
          // Backup dans localStorage
          localStorage.setItem('anarchytasks_fallback', JSON.stringify(updatedTasks));
          return updatedTasks;
        });
        return deletedCount;
      }
      return 0;
    } catch (err) {
      setError('Erreur lors de la suppression des tâches terminées');
      console.error('Erreur clearCompleted:', err);
      return 0;
    }
  }, []);

  // Rechercher des tâches
  const searchTasks = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      return tasks;
    }

    try {
      const results = await TaskDB.searchTasks(searchTerm.trim());
      return Array.isArray(results) ? results : [];
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error('Erreur searchTasks:', err);
      // Fallback vers recherche locale
      return Array.isArray(tasks) ? tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      ) : [];
    }
  }, [tasks]);

  // Obtenir les statistiques
  const getStats = useCallback(async () => {
    try {
      const stats = await TaskDB.getStats();
      return stats;
    } catch (err) {
      console.error('Erreur getStats:', err);
      // Fallback vers calcul local
      if (Array.isArray(tasks)) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        return { total, pending, completed };
      }
      return { total: 0, pending: 0, completed: 0 };
    }
  }, [tasks]);

  // Charger les tâches au montage du composant
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Effacer l'erreur après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    searchTasks,
    getStats,
    refreshTasks: loadTasks
  };
};

export default useTasks;