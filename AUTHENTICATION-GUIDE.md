# 🏴‍☠️ GUIDE D'AUTHENTIFICATION ANARCHYTASKS

## 🔐 Système d'Authentification Décentralisé

AnarchyTasks dispose maintenant d'un système d'authentification et de collaboration révolutionnaire !

---

## ✨ Nouvelles Fonctionnalités

### 🔑 **Authentification Anarchiste**
- **Comptes locaux** : Données stockées sur votre appareil
- **Aucun serveur central** : Autonomie totale
- **Chiffrement des mots de passe** : Sécurité SHA-256
- **Sessions persistantes** : Restez connecté 30 jours

### 👥 **Équipes Collaboratives**
- **Création d'équipes** : Formez votre collectif
- **Codes de partage** : Invitez facilement des membres
- **Tâches partagées** : Collaboration décentralisée
- **Rôles horizontaux** : Admin et membres égaux

---

## 🚀 Guide d'Utilisation

### 1. **Créer un Compte**

1. **Ouvrez AnarchyTasks**
2. **Cliquez sur "Rejoindre la résistance"**
3. **Remplissez le formulaire** :
   - Nom d'utilisateur (min. 3 caractères)
   - Email valide
   - Mot de passe (min. 6 caractères)
   - Confirmation du mot de passe
4. **Cliquez sur "CRÉER MON COMPTE"**

**✅ Votre compte est créé et vous êtes connecté !**

### 2. **Se Connecter**

1. **Entrez votre nom d'utilisateur**
2. **Entrez votre mot de passe**
3. **Cliquez sur "SE CONNECTER"**

**✅ Vous accédez à vos tâches personnelles !**

### 3. **Gérer son Profil**

1. **Cliquez sur votre avatar** (en haut à droite)
2. **Options disponibles** :
   - ✏️ Modifier Profil (à venir)
   - 👥 Mes Équipes
   - 🚪 Déconnexion
   - 💥 Supprimer Compte

---

## 👥 Collaboration en Équipe

### **Créer une Équipe**

1. **Cliquez sur votre profil** → "Mes Équipes"
2. **Onglet "Créer"**
3. **Remplissez** :
   - Nom de l'équipe
   - Description (optionnelle)
4. **Cliquez sur "CRÉER L'ÉQUIPE"**

**✅ Un code unique est généré (ex: ABC123)**

### **Rejoindre une Équipe**

1. **Demandez le code** à un membre existant
2. **Profil** → "Mes Équipes" → "Rejoindre"
3. **Entrez le code** (6 caractères)
4. **Cliquez sur "REJOINDRE L'ÉQUIPE"**

**✅ Vous êtes maintenant membre !**

### **Gérer ses Équipes**

Dans **"Mes Équipes"**, vous pouvez :
- **Voir toutes vos équipes**
- **Consulter les codes de partage**
- **Voir votre rôle** (Fondateur 🏴‍☠️ ou Camarade ✊)
- **Accéder aux tâches partagées** (à venir)

---

## 🔒 Sécurité et Vie Privée

### **Principes Anarchistes**
- **Aucun serveur central** : Tout est local
- **Aucune surveillance** : Vos données vous appartiennent
- **Chiffrement local** : Mots de passe sécurisés
- **Autonomie totale** : Contrôle complet

### **Stockage des Données**
```
IndexedDB (navigateur)
├── AnarchyAuthDB/
│   ├── users (comptes utilisateurs)
│   └── sessions (sessions actives)
├── AnarchyTeamsDB/
│   ├── teams (équipes créées)
│   ├── members (appartenances)
│   └── sharedTasks (tâches partagées)
└── AnarchyTasksDB/
    └── tasks (tâches personnelles)
```

### **Sauvegarde et Récupération**
- **Backup automatique** : localStorage en fallback
- **Export possible** : Vos données en JSON
- **Récupération** : Même après suppression du cache

---

## 🛠️ Fonctionnalités Techniques

### **Authentification**
```javascript
// Créer un compte
const result = await register(username, email, password);

// Se connecter
const result = await login(username, password);

// Déconnexion
await logout();
```

### **Équipes**
```javascript
// Créer une équipe
const team = await TeamsDB.createTeam(name, description, userId);

// Rejoindre avec un code
const result = await TeamsDB.joinTeam(code, userId);

// Obtenir ses équipes
const teams = await TeamsDB.getUserTeams(userId);
```

---

## 🎯 Cas d'Usage

### **Personnel**
- **Tâches privées** : Vos projets personnels
- **Multi-appareils** : Même compte sur plusieurs navigateurs
- **Sauvegarde locale** : Aucune perte de données

### **Équipe de Travail**
- **Projets collaboratifs** : Partagez vos tâches
- **Coordination** : Organisez-vous horizontalement
- **Transparence** : Tout le monde voit l'avancement

### **Collectifs Militants**
- **Actions coordonnées** : Planifiez ensemble
- **Sécurité** : Aucune trace sur des serveurs
- **Autonomie** : Indépendance technologique

---

## 🔮 Fonctionnalités à Venir

### **Version 2.1**
- [ ] **Tâches partagées** : Collaboration temps réel
- [ ] **Commentaires** : Discussion sur les tâches
- [ ] **Assignation** : Déléguer des responsabilités
- [ ] **Notifications** : Alertes de l'équipe

### **Version 2.2**
- [ ] **Synchronisation P2P** : Partage direct entre appareils
- [ ] **Chiffrement avancé** : Protection renforcée
- [ ] **Mode hors ligne** : Collaboration sans internet
- [ ] **Export d'équipe** : Sauvegarde collective

---

## 🏴‍☠️ Philosophie Anarchiste

### **Pourquoi cette Approche ?**

**❌ Systèmes Centralisés** :
- Surveillance constante
- Contrôle par les entreprises
- Dépendance aux serveurs
- Monétisation des données

**✅ Système Anarchiste** :
- Autonomie numérique
- Données sous votre contrôle
- Collaboration libre
- Résistance à la surveillance

### **Principes Appliqués**
1. **Horizontalité** : Pas de hiérarchie imposée
2. **Autonomie** : Chacun contrôle ses données
3. **Solidarité** : Partage volontaire et libre
4. **Résistance** : Indépendance technologique

---

## 🎉 BIENVENUE DANS LA RÉVOLUTION !

*« L'union fait la force, mais la liberté fait l'union »*

**Votre autonomie numérique commence maintenant !** 🏴‍☠️

---

### 🆘 Besoin d'Aide ?

- **TROUBLESHOOTING.md** : Guide de dépannage
- **GitHub Issues** : Signaler des bugs
- **Community** : Entraide entre révolutionnaires

**Vive la collaboration anarchiste !** ✊