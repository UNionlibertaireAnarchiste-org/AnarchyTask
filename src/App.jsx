import { useState, useMemo } from 'react'
import Button from './components/button/Button'
import Card from './components/card/Card'
import Input from './components/input/Input'
import { useTasks } from './hooks/useTasks'
import { AuthProvider } from './auth/AuthContext'
import AuthWrapper from './components/auth/AuthWrapper'
import './app.css'

function TasksApp() {
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [searchTerm, setSearchTerm] = useState('');

  // Utiliser le hook personnalisé pour SQLite
  const {
    tasks,
    loading,
    error,
    addTask: addTaskToDB,
    updateTask: updateTaskInDB,
    toggleTask: toggleTaskInDB,
    deleteTask: deleteTaskFromDB,
    clearCompleted: clearCompletedFromDB,
    getStats
  } = useTasks();

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const success = await addTaskToDB(inputValue.trim());
      if (success) {
        setInputValue('');
      }
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleUpdateTask = async (id, newText) => {
    await updateTaskInDB(id, newText);
  }

  const handleDeleteTask = async (id) => {
    await deleteTaskFromDB(id);
  }

  const handleToggleTask = async (id) => {
    await toggleTaskInDB(id);
  }

  const handleClearCompleted = async () => {
    await clearCompletedFromDB();
  }

  // Filtrer les tâches avec useMemo pour optimiser les performances
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

  // Calculer les statistiques localement
  const stats = useMemo(() => {
    if (!Array.isArray(tasks)) return { total: 0, pending: 0, completed: 0 };
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, pending, completed };
  }, [tasks]);
  
  const { total: totalTasks, pending: pendingCount, completed: completedCount } = stats;
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>🏴‍☠️ AnarchyTasks</h1>
        <p>Organisation libre sans hiérarchie !</p>
        <small>Ordre horizontal • Coopération libre • Auto-organisation</small>
      </header>

      <div className="main-container">
        <form onSubmit={handleAddTask} className="add-task-form">
          <Input 
            value={inputValue}
            onChange={handleInputChange} 
            placeholder="Organise librement une nouvelle idée..."
            disabled={loading}
          />
          <Button 
            text={loading ? "⏳ CHARGEMENT" : "🔥 CRÉER"} 
            color="#dc3545" 
            onClick={handleAddTask}
            disabled={loading}
          />
        </form>

        <div className="controls">
          <div className="search-container">
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Recherche dans l'organisation libre..."
            />
          </div>
          
          <div className="filter-buttons">
            <Button 
              text={`🌍 Toute l'organisation (${totalTasks})`}
              color={filter === 'all' ? '#dc3545' : '#6c757d'}
              onClick={() => setFilter('all')}
            />
            <Button 
              text={`🔄 En action (${pendingCount})`}
              color={filter === 'pending' ? '#ff6b35' : '#6c757d'}
              onClick={() => setFilter('pending')}
            />
            <Button 
              text={`✊ Libérées (${completedCount})`}
              color={filter === 'completed' ? '#2d5016' : '#6c757d'}
              onClick={() => setFilter('completed')}
            />
          </div>

          {completedCount > 0 && (
            <Button 
              text="🔥 PURGER LES LIBÉRÉES"
              color="#8b0000"
              onClick={handleClearCompleted}
              disabled={loading}
            />
          )}
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        <div className="task-list">
          {loading ? (
            <div className="loading-state">
              <p>⏳ Chargement de votre organisation libre...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchTerm ? '🔍 Aucun résultat dans l\'organisation...' : 
                 filter === 'completed' ? '✊ Aucune tâche accomplie encore...' :
                 filter === 'pending' ? '🔄 Aucune action en cours...' :
                 '🏴‍☠️ Espace libre... Commence ton organisation !'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <Card 
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
              />
            ))
          )}
        </div>

        <div className="stats">
          <p>🏴‍☠️ Organisation libre: {totalTasks} idées | 🔄 En action: {pendingCount} | ✊ Accomplies: {completedCount}</p>
          <small>« L'anarchie, c'est l'ordre moins le pouvoir » - Données sauvegardées en IndexedDB</small>
        </div>
      </div>
    </div>
  )
}

// Composant principal avec authentification
function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <TasksApp />
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App
