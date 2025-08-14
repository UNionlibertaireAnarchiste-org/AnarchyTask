// Base de données IndexedDB pour AnarchyTasks
// Alternative anarchiste à SQLite pour le navigateur

const DB_NAME = 'AnarchyTasksDB';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

class AnarchyDB {
  constructor() {
    this.db = null;
  }

  // Initialiser la base de données
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Erreur ouverture IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('🏴‍☠️ Base de données AnarchyTasks initialisée');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Créer le store des tâches
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Créer des index pour les recherches
          store.createIndex('text', 'text', { unique: false });
          store.createIndex('completed', 'completed', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          
          console.log('✅ Store "tasks" créé avec index');
        }
      };
    });
  }

  // Récupérer toutes les tâches
  async getAllTasks() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const tasks = request.result.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(tasks);
      };

      request.onerror = () => {
        console.error('Erreur getAllTasks:', request.error);
        reject(request.error);
      };
    });
  }

  // Ajouter une nouvelle tâche
  async addTask(text) {
    if (!this.db) await this.init();
    
    const task = {
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(task);

      request.onsuccess = () => {
        task.id = request.result;
        resolve(task);
      };

      request.onerror = () => {
        console.error('Erreur addTask:', request.error);
        reject(request.error);
      };
    });
  }

  // Mettre à jour une tâche
  async updateTask(id, text, completed) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const task = getRequest.result;
        if (!task) {
          reject(new Error('Tâche non trouvée'));
          return;
        }

        task.text = text;
        task.completed = completed;
        task.updatedAt = new Date().toISOString();

        const updateRequest = store.put(task);
        
        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = () => {
          console.error('Erreur updateTask:', updateRequest.error);
          reject(updateRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Erreur get task:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  // Supprimer une tâche
  async deleteTask(id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Erreur deleteTask:', request.error);
        reject(request.error);
      };
    });
  }

  // Supprimer toutes les tâches terminées
  async deleteCompletedTasks() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('completed');
      const request = index.openCursor(IDBKeyRange.only(true));
      
      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          deletedCount++;
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };

      request.onerror = () => {
        console.error('Erreur deleteCompletedTasks:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir les statistiques
  async getStats() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const tasks = request.result;
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        resolve({ total, pending, completed });
      };

      request.onerror = () => {
        console.error('Erreur getStats:', request.error);
        reject(request.error);
      };
    });
  }

  // Rechercher des tâches
  async searchTasks(searchTerm) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const tasks = request.result;
        const filtered = tasks.filter(task => 
          task.text.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        resolve(filtered);
      };

      request.onerror = () => {
        console.error('Erreur searchTasks:', request.error);
        reject(request.error);
      };
    });
  }

  // Vider complètement la base
  async clearAll() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Erreur clearAll:', request.error);
        reject(request.error);
      };
    });
  }

  // Exporter toutes les données
  async exportData() {
    const tasks = await this.getAllTasks();
    const exportData = {
      version: DB_VERSION,
      exportDate: new Date().toISOString(),
      tasks: tasks
    };
    return JSON.stringify(exportData, null, 2);
  }

  // Importer des données
  async importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Format de données invalide');
      }

      // Vider la base actuelle
      await this.clearAll();

      // Importer les nouvelles tâches
      for (const task of data.tasks) {
        await this.addTask(task.text);
      }

      return data.tasks.length;
    } catch (error) {
      console.error('Erreur importData:', error);
      throw error;
    }
  }
}

// Instance singleton
const anarchyDB = new AnarchyDB();

// API publique
export const TaskDB = {
  async getAllTasks() {
    try {
      return await anarchyDB.getAllTasks();
    } catch (error) {
      console.error('Erreur getAllTasks:', error);
      return [];
    }
  },

  async addTask(text) {
    try {
      return await anarchyDB.addTask(text);
    } catch (error) {
      console.error('Erreur addTask:', error);
      return null;
    }
  },

  async updateTask(id, text, completed) {
    try {
      return await anarchyDB.updateTask(id, text, completed);
    } catch (error) {
      console.error('Erreur updateTask:', error);
      return false;
    }
  },

  async deleteTask(id) {
    try {
      return await anarchyDB.deleteTask(id);
    } catch (error) {
      console.error('Erreur deleteTask:', error);
      return false;
    }
  },

  async deleteCompletedTasks() {
    try {
      return await anarchyDB.deleteCompletedTasks();
    } catch (error) {
      console.error('Erreur deleteCompletedTasks:', error);
      return 0;
    }
  },

  async getStats() {
    try {
      return await anarchyDB.getStats();
    } catch (error) {
      console.error('Erreur getStats:', error);
      return { total: 0, pending: 0, completed: 0 };
    }
  },

  async searchTasks(searchTerm) {
    try {
      return await anarchyDB.searchTasks(searchTerm);
    } catch (error) {
      console.error('Erreur searchTasks:', error);
      return [];
    }
  },

  async exportData() {
    try {
      return await anarchyDB.exportData();
    } catch (error) {
      console.error('Erreur exportData:', error);
      return null;
    }
  },

  async importData(jsonData) {
    try {
      return await anarchyDB.importData(jsonData);
    } catch (error) {
      console.error('Erreur importData:', error);
      throw error;
    }
  }
};

export default TaskDB;