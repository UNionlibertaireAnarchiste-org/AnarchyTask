# 🗄️ BASE DE DONNÉES ANARCHYTASKS

## 🏴‍☠️ IndexedDB : Liberté de Données

AnarchyTasks utilise **IndexedDB** pour la persistance des données, respectant nos principes anarchistes :

- **🔒 Autonomie** : Base de données locale, aucun serveur externe
- **🌍 Liberté** : Aucune dépendance cloud ou service tiers
- **✊ Contrôle** : Vous possédez 100% de vos données
- **🔄 Simplicité** : Fichier unique, facile à sauvegarder

---

## 📊 Structure de la Base

### Object Store `tasks`
```javascript
{
  id: number,           // Clé primaire auto-incrémentée
  text: string,         // Texte de la tâche
  completed: boolean,   // Statut terminé/en cours
  createdAt: string,    // Date de création (ISO)
  updatedAt: string     // Date de modification (ISO)
}
```

### Index Créés
```javascript
// Index pour les recherches optimisées
store.createIndex('text', 'text', { unique: false });
store.createIndex('completed', 'completed', { unique: false });
store.createIndex('createdAt', 'createdAt', { unique: false });
```

---

## 🛠️ Commandes Utiles

### Initialiser la Base
```bash
npm run init-db
```

### Réinitialiser la Base
```bash
npm run db:reset
```

### Sauvegarder la Base
```bash
cp anarchytasks.db anarchytasks_backup_$(date +%Y%m%d).db
```

### Inspecter la Base (SQLite CLI)
```bash
sqlite3 anarchytasks.db
.tables
.schema tasks
SELECT * FROM tasks;
.quit
```

---

## 🔄 API de la Base de Données

### TaskDB.getAllTasks()
Récupère toutes les tâches triées par date de création.

### TaskDB.addTask(text)
Ajoute une nouvelle tâche avec le texte spécifié.

### TaskDB.updateTask(id, text, completed)
Met à jour une tâche existante.

### TaskDB.deleteTask(id)
Supprime une tâche par son ID.

### TaskDB.deleteCompletedTasks()
Supprime toutes les tâches terminées.

### TaskDB.getStats()
Retourne les statistiques (total, en cours, terminées).

### TaskDB.searchTasks(searchTerm)
Recherche des tâches contenant le terme spécifié.

---

## 🔒 Sécurité et Sauvegarde

### Localisation du Fichier
- **Fichier** : `anarchytasks.db`
- **Emplacement** : Racine du projet
- **Taille** : Généralement < 1MB

### Stratégie de Sauvegarde
1. **Automatique** : Backup dans localStorage en cas d'erreur SQLite
2. **Manuelle** : Copiez le fichier `.db` régulièrement
3. **Export** : Utilisez les outils SQLite pour exporter en JSON/CSV

### Récupération d'Urgence
En cas de corruption de la base :
1. L'app utilise automatiquement localStorage comme fallback
2. Restaurez depuis une sauvegarde `.db`
3. Réinitialisez avec `npm run db:reset`

---

## 🏴‍☠️ Philosophie Anarchiste

### Pourquoi IndexedDB ?
- **Décentralisé** : Stockage local dans le navigateur
- **Autonome** : Fonctionne hors ligne
- **Libre** : Standard web ouvert
- **Performant** : Accès asynchrone optimisé
- **Sécurisé** : Isolé par origine

### Vs. Autres Solutions
| Aspect | IndexedDB | Cloud DB | SaaS |
|--------|-----------|----------|------|
| **Contrôle** | ✅ Total | ❌ Limité | ❌ Aucun |
| **Vie privée** | ✅ Absolue | ❌ Compromise | ❌ Surveillée |
| **Coût** | ✅ Gratuit | 💰 Payant | 💰💰 Cher |
| **Dépendance** | ✅ Aucune | ❌ Internet | ❌ Fournisseur |
| **Liberté** | ✅ Maximale | ❌ Restreinte | ❌ Contrôlée |

---

## 🔧 Développement

### Hook Personnalisé
Le hook `useTasks()` encapsule toute la logique de base de données :

```javascript
const {
  tasks,
  loading,
  error,
  addTask,
  updateTask,
  toggleTask,
  deleteTask,
  clearCompleted,
  getStats
} = useTasks();
```

### Gestion d'Erreurs
- **Fallback automatique** vers localStorage
- **Messages d'erreur** utilisateur-friendly
- **Retry automatique** sur certaines opérations
- **Logging** pour le débogage

### Performance
- **Requêtes préparées** pour la vitesse
- **Transactions** pour la cohérence
- **Index automatiques** sur les clés primaires
- **Optimisation** des requêtes fréquentes

---

## 🎯 Évolutions Futures

### Version 2.1
- [ ] Synchronisation P2P entre appareils
- [ ] Chiffrement des données sensibles
- [ ] Export/Import JSON
- [ ] Historique des modifications

### Version 2.2
- [ ] Base de données distribuée
- [ ] Réplication automatique
- [ ] Résolution de conflits
- [ ] Mode collaboratif anarchiste

---

## 🏴‍☠️ VIVE LA LIBERTÉ DES DONNÉES !

*« Vos données vous appartiennent. Point final. »*

**SQLite + AnarchyTasks = Autonomie numérique totale** 🔥