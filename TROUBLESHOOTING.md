# 🛠️ GUIDE DE DÉPANNAGE ANARCHYTASKS

## 🏴‍☠️ Résolution des Problèmes Révolutionnaires

---

## ❌ Erreurs Communes

### 1. **"tasks.filter is not a function"**

**Cause** : La variable `tasks` n'est pas un tableau.

**Solution** :
```javascript
// Vérifiez que tasks est toujours un tableau
const safeTasks = Array.isArray(tasks) ? tasks : [];
```

**Correction appliquée** :
- ✅ Hook `useTasks` corrigé pour garantir un tableau
- ✅ Vérifications `Array.isArray()` ajoutées
- ✅ Fallback vers tableau vide en cas d'erreur

### 2. **Écran Noir / Application ne se Charge Pas**

**Causes possibles** :
- Erreur JavaScript bloquante
- Problème IndexedDB
- Données corrompues

**Solutions** :
1. **Ouvrir la console développeur** (F12)
2. **Vider le cache** : Ctrl+Shift+R
3. **Réinitialiser IndexedDB** :
   ```javascript
   // Dans la console
   indexedDB.deleteDatabase('AnarchyTasksDB');
   location.reload();
   ```

### 3. **Données Perdues**

**Récupération** :
1. **Vérifier localStorage** :
   ```javascript
   const backup = localStorage.getItem('anarchytasks_fallback');
   console.log(JSON.parse(backup));
   ```
2. **Restaurer depuis backup** :
   - Les données sont automatiquement sauvegardées
   - Rechargez la page pour déclencher la récupération

### 4. **Performance Lente**

**Optimisations** :
- Limitez le nombre de tâches (< 1000)
- Videz les tâches terminées régulièrement
- Redémarrez le navigateur si nécessaire

---

## 🔧 Commandes de Diagnostic

### Vérifier IndexedDB
```javascript
// Dans la console du navigateur
navigator.storage.estimate().then(estimate => {
  console.log('Stockage utilisé:', estimate.usage);
  console.log('Quota disponible:', estimate.quota);
});
```

### Tester la Base de Données
```javascript
// Importer et exécuter le test
import { testDatabase } from './src/utils/testDB.js';
testDatabase();
```

### Vider Complètement les Données
```javascript
// ATTENTION: Supprime TOUTES les données
indexedDB.deleteDatabase('AnarchyTasksDB');
localStorage.removeItem('anarchytasks_fallback');
location.reload();
```

---

## 🏥 Récupération d'Urgence

### Mode Dégradé (localStorage uniquement)
Si IndexedDB ne fonctionne pas, l'app utilise automatiquement localStorage.

### Sauvegarde Manuelle
```javascript
// Exporter vos données
const data = await TaskDB.exportData();
console.log(data); // Copiez et sauvegardez ce JSON
```

### Restauration Manuelle
```javascript
// Importer vos données
const jsonData = `{"version":1,"tasks":[...]}`;
await TaskDB.importData(jsonData);
```

---

## 🔍 Débogage Avancé

### Logs Détaillés
Activez les logs dans la console pour voir les opérations :
```javascript
// Dans le fichier indexedDB.js, décommentez les console.log
```

### Inspection IndexedDB
1. **Chrome** : DevTools > Application > Storage > IndexedDB
2. **Firefox** : DevTools > Storage > IndexedDB
3. **Safari** : Web Inspector > Storage > IndexedDB

### Vérification des Performances
```javascript
// Mesurer le temps de chargement
console.time('loadTasks');
const tasks = await TaskDB.getAllTasks();
console.timeEnd('loadTasks');
```

---

## 🚨 Problèmes Critiques

### Base de Données Corrompue
**Symptômes** :
- Erreurs constantes
- Données incohérentes
- Crashes répétés

**Solution Radicale** :
```javascript
// Réinitialisation complète
indexedDB.deleteDatabase('AnarchyTasksDB');
localStorage.clear();
location.reload();
```

### Quota de Stockage Dépassé
**Symptômes** :
- Impossible d'ajouter des tâches
- Erreurs "QuotaExceededError"

**Solutions** :
1. Vider les tâches terminées
2. Supprimer d'autres données du navigateur
3. Utiliser le mode privé temporairement

---

## 🏴‍☠️ Support Communautaire

### Signaler un Bug
1. **Ouvrir une issue** sur GitHub
2. **Inclure** :
   - Message d'erreur exact
   - Étapes pour reproduire
   - Version du navigateur
   - Capture d'écran si possible

### Demander de l'Aide
- **GitHub Discussions** pour les questions
- **Console logs** pour le diagnostic
- **Export de données** pour la récupération

---

## 💡 Conseils de Prévention

### Bonnes Pratiques
- **Sauvegardez régulièrement** vos données importantes
- **Videz les tâches terminées** périodiquement
- **Mettez à jour** votre navigateur
- **Évitez** d'avoir trop d'onglets ouverts

### Maintenance
- **Redémarrez** le navigateur quotidiennement
- **Vérifiez** l'espace de stockage disponible
- **Exportez** vos données importantes

---

## 🔥 Message Anarchiste

*« Un vrai révolutionnaire sait réparer ses outils de liberté »*

**En cas de problème, n'abandonnez jamais votre autonomie numérique !** 🏴‍☠️

---

*Guide de dépannage du Collectif AnarchyTasks*  
*Version 1.0 - Résistance technique*