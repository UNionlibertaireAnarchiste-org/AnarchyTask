// Base de données d'authentification anarchiste (IndexedDB)
// Système décentralisé sans serveur central

const AUTH_DB_NAME = 'AnarchyAuthDB';
const AUTH_DB_VERSION = 1;
const USERS_STORE = 'users';
const SESSIONS_STORE = 'sessions';

class AnarchyAuthDB {
  constructor() {
    this.db = null;
  }

  // Initialiser la base d'authentification
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(AUTH_DB_NAME, AUTH_DB_VERSION);

      request.onerror = () => {
        console.error('Erreur ouverture AuthDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('🏴‍☠️ Base d\'authentification anarchiste initialisée');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store des utilisateurs
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const usersStore = db.createObjectStore(USERS_STORE, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          usersStore.createIndex('username', 'username', { unique: true });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('createdAt', 'createdAt', { unique: false });
          
          console.log('✅ Store "users" créé');
        }

        // Store des sessions
        if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
          const sessionsStore = db.createObjectStore(SESSIONS_STORE, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          sessionsStore.createIndex('userId', 'userId', { unique: false });
          sessionsStore.createIndex('token', 'token', { unique: true });
          
          console.log('✅ Store "sessions" créé');
        }
      };
    });
  }

  // Hacher un mot de passe (simple pour le démo)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'anarchist_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Générer un token de session
  generateToken() {
    return crypto.randomUUID();
  }

  // Créer un utilisateur anarchiste
  async createUser(username, email, password) {
    if (!this.db) await this.init();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.getUserByUsername(username);
    if (existingUser) {
      throw new Error('Ce nom d\'utilisateur existe déjà');
    }

    const existingEmail = await this.getUserByEmail(email);
    if (existingEmail) {
      throw new Error('Cet email est déjà utilisé');
    }

    const hashedPassword = await this.hashPassword(password);
    
    const user = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      profile: {
        displayName: username,
        avatar: '🏴‍☠️',
        bio: 'Révolutionnaire numérique',
        joinedTeams: []
      }
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.add(user);

      request.onsuccess = () => {
        user.id = request.result;
        delete user.password; // Ne pas retourner le mot de passe
        resolve(user);
      };

      request.onerror = () => {
        console.error('Erreur createUser:', request.error);
        reject(request.error);
      };
    });
  }

  // Connexion utilisateur
  async loginUser(username, password) {
    if (!this.db) await this.init();
    
    const user = await this.getUserByUsername(username);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const hashedPassword = await this.hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new Error('Mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new Error('Compte désactivé');
    }

    // Créer une session
    const session = await this.createSession(user.id);
    
    // Sauvegarder la session courante
    localStorage.setItem('anarchyauth_session', session.token);
    
    delete user.password;
    return user;
  }

  // Créer une session
  async createSession(userId) {
    const session = {
      userId,
      token: this.generateToken(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
      isActive: true
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SESSIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SESSIONS_STORE);
      const request = store.add(session);

      request.onsuccess = () => {
        session.id = request.result;
        resolve(session);
      };

      request.onerror = () => {
        console.error('Erreur createSession:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir l'utilisateur courant
  async getCurrentUser() {
    const token = localStorage.getItem('anarchyauth_session');
    if (!token) return null;

    const session = await this.getSessionByToken(token);
    if (!session || !session.isActive) return null;

    // Vérifier l'expiration
    if (new Date(session.expiresAt) < new Date()) {
      await this.invalidateSession(session.id);
      localStorage.removeItem('anarchyauth_session');
      return null;
    }

    const user = await this.getUserById(session.userId);
    if (user) {
      delete user.password;
    }
    return user;
  }

  // Déconnexion
  async logoutUser() {
    const token = localStorage.getItem('anarchyauth_session');
    if (token) {
      const session = await this.getSessionByToken(token);
      if (session) {
        await this.invalidateSession(session.id);
      }
      localStorage.removeItem('anarchyauth_session');
    }
  }

  // Obtenir utilisateur par nom
  async getUserByUsername(username) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const index = store.index('username');
      const request = index.get(username);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Erreur getUserByUsername:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir utilisateur par email
  async getUserByEmail(email) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const index = store.index('email');
      const request = index.get(email.toLowerCase());

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Erreur getUserByEmail:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir utilisateur par ID
  async getUserById(id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Erreur getUserById:', request.error);
        reject(request.error);
      };
    });
  }

  // Obtenir session par token
  async getSessionByToken(token) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SESSIONS_STORE], 'readonly');
      const store = transaction.objectStore(SESSIONS_STORE);
      const index = store.index('token');
      const request = index.get(token);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Erreur getSessionByToken:', request.error);
        reject(request.error);
      };
    });
  }

  // Invalider une session
  async invalidateSession(sessionId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SESSIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SESSIONS_STORE);
      const getRequest = store.get(sessionId);

      getRequest.onsuccess = () => {
        const session = getRequest.result;
        if (session) {
          session.isActive = false;
          const updateRequest = store.put(session);
          
          updateRequest.onsuccess = () => resolve(true);
          updateRequest.onerror = () => {
            console.error('Erreur invalidateSession update:', updateRequest.error);
            reject(updateRequest.error);
          };
        } else {
          resolve(false);
        }
      };

      getRequest.onerror = () => {
        console.error('Erreur invalidateSession get:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  // Mettre à jour un utilisateur
  async updateUser(userId, updates) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const getRequest = store.get(userId);

      getRequest.onsuccess = () => {
        const user = getRequest.result;
        if (!user) {
          reject(new Error('Utilisateur non trouvé'));
          return;
        }

        // Appliquer les mises à jour
        Object.assign(user, updates);
        user.updatedAt = new Date().toISOString();

        const updateRequest = store.put(user);
        
        updateRequest.onsuccess = () => {
          delete user.password;
          resolve(user);
        };
        
        updateRequest.onerror = () => {
          console.error('Erreur updateUser:', updateRequest.error);
          reject(updateRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Erreur updateUser get:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  // Supprimer un utilisateur
  async deleteUser(userId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE, SESSIONS_STORE], 'readwrite');
      
      // Supprimer l'utilisateur
      const usersStore = transaction.objectStore(USERS_STORE);
      const deleteUserRequest = usersStore.delete(userId);
      
      // Supprimer toutes ses sessions
      const sessionsStore = transaction.objectStore(SESSIONS_STORE);
      const sessionsIndex = sessionsStore.index('userId');
      const sessionsRequest = sessionsIndex.openCursor(IDBKeyRange.only(userId));
      
      sessionsRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => {
        console.error('Erreur deleteUser:', transaction.error);
        reject(transaction.error);
      };
    });
  }
}

// Instance singleton
const anarchyAuthDB = new AnarchyAuthDB();

// API publique
export const AuthDB = {
  async createUser(username, email, password) {
    try {
      return await anarchyAuthDB.createUser(username, email, password);
    } catch (error) {
      console.error('Erreur createUser:', error);
      throw error;
    }
  },

  async loginUser(username, password) {
    try {
      return await anarchyAuthDB.loginUser(username, password);
    } catch (error) {
      console.error('Erreur loginUser:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await anarchyAuthDB.getCurrentUser();
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      return null;
    }
  },

  async logoutUser() {
    try {
      return await anarchyAuthDB.logoutUser();
    } catch (error) {
      console.error('Erreur logoutUser:', error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    try {
      return await anarchyAuthDB.updateUser(userId, updates);
    } catch (error) {
      console.error('Erreur updateUser:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      return await anarchyAuthDB.deleteUser(userId);
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      throw error;
    }
  }
};

export default AuthDB;