// Base de données des équipes anarchistes (IndexedDB)
// Système de collaboration décentralisé

const TEAMS_DB_NAME = 'AnarchyTeamsDB';
const TEAMS_DB_VERSION = 1;
const TEAMS_STORE = 'teams';
const MEMBERS_STORE = 'members';
const SHARED_TASKS_STORE = 'sharedTasks';

class AnarchyTeamsDB {
  constructor() {
    this.db = null;
  }

  // Initialiser la base des équipes
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(TEAMS_DB_NAME, TEAMS_DB_VERSION);

      request.onerror = () => {
        console.error('Erreur ouverture TeamsDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('🏴‍☠️ Base des équipes anarchistes initialisée');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store des équipes
        if (!db.objectStoreNames.contains(TEAMS_STORE)) {
          const teamsStore = db.createObjectStore(TEAMS_STORE, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          teamsStore.createIndex('name', 'name', { unique: false });
          teamsStore.createIndex('code', 'code', { unique: true });
          teamsStore.createIndex('createdBy', 'createdBy', { unique: false });
          
          console.log('✅ Store "teams" créé');
        }

        // Store des membres
        if (!db.objectStoreNames.contains(MEMBERS_STORE)) {
          const membersStore = db.createObjectStore(MEMBERS_STORE, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          membersStore.createIndex('teamId', 'teamId', { unique: false });
          membersStore.createIndex('userId', 'userId', { unique: false });
          membersStore.createIndex('teamUser', ['teamId', 'userId'], { unique: true });
          
          console.log('✅ Store "members" créé');
        }

        // Store des tâches partagées
        if (!db.objectStoreNames.contains(SHARED_TASKS_STORE)) {
          const sharedTasksStore = db.createObjectStore(SHARED_TASKS_STORE, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          sharedTasksStore.createIndex('teamId', 'teamId', { unique: false });
          sharedTasksStore.createIndex('createdBy', 'createdBy', { unique: false });
          sharedTasksStore.createIndex('assignedTo', 'assignedTo', { unique: false });
          
          console.log('✅ Store "sharedTasks" créé');
        }
      };
    });
  }

  // Générer un code d'équipe unique
  generateTeamCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Créer une équipe anarchiste
  async createTeam(name, description, createdBy) {
    if (!this.db) await this.init();
    
    const team = {
      name: name.trim(),
      description: description.trim(),
      code: this.generateTeamCode(),
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      settings: {
        isPublic: false,
        allowInvites: true,
        maxMembers: 50 // Limite technique, pas hiérarchique
      }
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TEAMS_STORE, MEMBERS_STORE], 'readwrite');
      
      // Créer l'équipe
      const teamsStore = transaction.objectStore(TEAMS_STORE);
      const teamRequest = teamsStore.add(team);

      teamRequest.onsuccess = () => {
        team.id = teamRequest.result;
        
        // Ajouter le créateur comme membre fondateur
        const membersStore = transaction.objectStore(MEMBERS_STORE);
        const member = {
          teamId: team.id,
          userId: createdBy,
          role: 'fondateur',
          joinedAt: new Date().toISOString(),
          isActive: true
        };
        
        const memberRequest = membersStore.add(member);
        
        memberRequest.onsuccess = () => {
          resolve(team);
        };
        
        memberRequest.onerror = () => {
          console.error('Erreur ajout membre:', memberRequest.error);
          reject(memberRequest.error);
        };
      };

      teamRequest.onerror = () => {
        console.error('Erreur createTeam:', teamRequest.error);
        reject(teamRequest.error);
      };
    });
  }

  // Rejoindre une équipe avec un code
  async joinTeam(teamCode, userId) {
    if (!this.db) await this.init();
    
    // Trouver l'équipe par code
    const team = await this.getTeamByCode(teamCode);
    if (!team) {
      throw new Error('Code d\'équipe invalide');
    }

    if (!team.isActive) {
      throw new Error('Cette équipe n\'est plus active');
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = await this.getTeamMember(team.id, userId);
    if (existingMember) {
      throw new Error('Vous êtes déjà membre de cette équipe');
    }

    // Ajouter comme membre
    const member = {
      teamId: team.id,
      userId,
      role: 'camarade',
      joinedAt: new Date().toISOString(),
      isActive: true
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([MEMBERS_STORE], 'readwrite');
      const store = transaction.objectStore(MEMBERS_STORE);
      const request = store.add(member);

      request.onsuccess = () => {
        member.id = request.result;
        resolve({ team, member });
      };

      request.onerror = () => {
        console.error('Erreur joinTeam:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir une équipe par code
  async getTeamByCode(code) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TEAMS_STORE], 'readonly');
      const store = transaction.objectStore(TEAMS_STORE);
      const index = store.index('code');
      const request = index.get(code);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Erreur getTeamByCode:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir un membre d'équipe
  async getTeamMember(teamId, userId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([MEMBERS_STORE], 'readonly');
      const store = transaction.objectStore(MEMBERS_STORE);
      const index = store.index('teamUser');
      const request = index.get([teamId, userId]);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Erreur getTeamMember:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir les équipes d'un utilisateur
  async getUserTeams(userId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([MEMBERS_STORE, TEAMS_STORE], 'readonly');
      const membersStore = transaction.objectStore(MEMBERS_STORE);
      const teamsStore = transaction.objectStore(TEAMS_STORE);
      
      const membersIndex = membersStore.index('userId');
      const request = membersIndex.getAll(userId);

      request.onsuccess = () => {
        const memberships = request.result.filter(m => m.isActive);
        const teamPromises = memberships.map(membership => {
          return new Promise((resolveTeam) => {
            const teamRequest = teamsStore.get(membership.teamId);
            teamRequest.onsuccess = () => {
              const team = teamRequest.result;
              if (team && team.isActive) {
                resolveTeam({ ...team, membership });
              } else {
                resolveTeam(null);
              }
            };
            teamRequest.onerror = () => resolveTeam(null);
          });
        });

        Promise.all(teamPromises).then(teams => {
          resolve(teams.filter(team => team !== null));
        });
      };

      request.onerror = () => {
        console.error('Erreur getUserTeams:', request.error);
        reject(request.error);
      };
    });
  }

  // Créer une tâche partagée
  async createSharedTask(teamId, text, createdBy, assignedTo = null) {
    if (!this.db) await this.init();
    
    const sharedTask = {
      teamId,
      text: text.trim(),
      completed: false,
      createdBy,
      assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SHARED_TASKS_STORE], 'readwrite');
      const store = transaction.objectStore(SHARED_TASKS_STORE);
      const request = store.add(sharedTask);

      request.onsuccess = () => {
        sharedTask.id = request.result;
        resolve(sharedTask);
      };

      request.onerror = () => {
        console.error('Erreur createSharedTask:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir les tâches partagées d'une équipe
  async getTeamTasks(teamId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SHARED_TASKS_STORE], 'readonly');
      const store = transaction.objectStore(SHARED_TASKS_STORE);
      const index = store.index('teamId');
      const request = index.getAll(teamId);

      request.onsuccess = () => {
        const tasks = request.result.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(tasks);
      };

      request.onerror = () => {
        console.error('Erreur getTeamTasks:', request.error);
        reject(request.error);
      };
    });
  }

  // Mettre à jour une tâche partagée
  async updateSharedTask(taskId, text, completed = null) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SHARED_TASKS_STORE], 'readwrite');
      const store = transaction.objectStore(SHARED_TASKS_STORE);
      const getRequest = store.get(taskId);

      getRequest.onsuccess = () => {
        const task = getRequest.result;
        if (!task) {
          reject(new Error('Tâche non trouvée'));
          return;
        }

        // Mettre à jour les champs
        if (text !== undefined) task.text = text.trim();
        if (completed !== null) task.completed = completed;
        task.updatedAt = new Date().toISOString();

        const updateRequest = store.put(task);
        
        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = () => {
          console.error('Erreur updateSharedTask:', updateRequest.error);
          reject(updateRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Erreur get shared task:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  // Supprimer une tâche partagée
  async deleteSharedTask(taskId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SHARED_TASKS_STORE], 'readwrite');
      const store = transaction.objectStore(SHARED_TASKS_STORE);
      const request = store.delete(taskId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Erreur deleteSharedTask:', request.error);
        reject(request.error);
      };
    });
  }
}

// Instance singleton
const anarchyTeamsDB = new AnarchyTeamsDB();

// API publique
export const TeamsDB = {
  async createTeam(name, description, createdBy) {
    try {
      return await anarchyTeamsDB.createTeam(name, description, createdBy);
    } catch (error) {
      console.error('Erreur createTeam:', error);
      throw error;
    }
  },

  async joinTeam(teamCode, userId) {
    try {
      return await anarchyTeamsDB.joinTeam(teamCode, userId);
    } catch (error) {
      console.error('Erreur joinTeam:', error);
      throw error;
    }
  },

  async getUserTeams(userId) {
    try {
      return await anarchyTeamsDB.getUserTeams(userId);
    } catch (error) {
      console.error('Erreur getUserTeams:', error);
      return [];
    }
  },

  async createSharedTask(teamId, text, createdBy, assignedTo) {
    try {
      return await anarchyTeamsDB.createSharedTask(teamId, text, createdBy, assignedTo);
    } catch (error) {
      console.error('Erreur createSharedTask:', error);
      throw error;
    }
  },

  async getTeamTasks(teamId) {
    try {
      return await anarchyTeamsDB.getTeamTasks(teamId);
    } catch (error) {
      console.error('Erreur getTeamTasks:', error);
      return [];
    }
  },

  async updateSharedTask(taskId, text, completed = null) {
    try {
      return await anarchyTeamsDB.updateSharedTask(taskId, text, completed);
    } catch (error) {
      console.error('Erreur updateSharedTask:', error);
      throw error;
    }
  },

  async deleteSharedTask(taskId) {
    try {
      return await anarchyTeamsDB.deleteSharedTask(taskId);
    } catch (error) {
      console.error('Erreur deleteSharedTask:', error);
      throw error;
    }
  }
};

export default TeamsDB;