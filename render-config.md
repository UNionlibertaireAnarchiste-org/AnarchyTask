# 🏴‍☠️ Configuration Render pour AnarchyTasks

## 📋 Configuration Manuelle sur Render

Si le déploiement automatique échoue, utilisez cette configuration manuelle :

### 🔧 Paramètres de Base
- **Name**: `anarchytasks`
- **Repository**: `https://github.com/UNionlibertaireAnarchiste-org/AnarchyTask.git`
- **Branch**: `main`

### 🏗️ Build Settings
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Auto-Deploy**: `Yes`

### 🌐 Environment
- **Environment**: `Static Site` (PAS Node.js)

### 📁 Advanced Settings
- **Pull Request Previews**: `Enabled`
- **Auto-Deploy**: `Yes`

## 🚨 Résolution d'Erreurs

### Erreur "Missing script: start"
Cette erreur indique que Render essaie de lancer un serveur Node.js au lieu d'un site statique.

**Solution** :
1. Vérifiez que le type est bien **"Static Site"**
2. PAS de "Web Service" ou "Node.js"
3. Aucune commande start n'est nécessaire pour un site statique

### Erreur de Build
Si le build échoue :
1. Utilisez `npm ci` au lieu de `npm install`
2. Vérifiez que `dist/` est bien généré
3. Assurez-vous que toutes les dépendances sont dans `dependencies`

## 🎯 Configuration Correcte

```yaml
# render.yaml (automatique)
services:
  - type: web
    name: anarchytasks
    env: static  # ← IMPORTANT: static, pas node
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
```

## 🔄 Redéploiement

Pour forcer un redéploiement :
1. Aller sur Render Dashboard
2. Sélectionner le service
3. Cliquer "Manual Deploy"
4. Ou pusher un commit vide sur GitHub

## 🏴‍☠️ Vérification Post-Déploiement

Une fois déployé, tester avec :
```bash
./scripts/check-deployment.sh
```

**La révolution anarchiste ne s'arrête jamais !** ✊🔥