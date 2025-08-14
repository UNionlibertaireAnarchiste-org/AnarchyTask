#!/bin/bash

# 🏴‍☠️ Script de déploiement AnarchyTasks sur Render
# Version gratuite - Déploiement automatique

echo "🏴‍☠️ DÉPLOIEMENT ANARCHYTASKS SUR RENDER"
echo "========================================"

# Vérifications préalables
echo "🔍 Vérifications préalables..."

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : package.json non trouvé"
    echo "   Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Vérifier que le build fonctionne
echo "🔨 Test du build local..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur : Build échoué localement"
    echo "   Corrigez les erreurs avant de déployer"
    exit 1
fi

echo "✅ Build local réussi !"

# Vérifier que Git est configuré
echo "📡 Vérification Git..."
git status > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Erreur : Pas un dépôt Git"
    exit 1
fi

# Vérifier que tout est commité
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Attention : Changements non commités détectés"
    echo "   Voulez-vous commiter automatiquement ? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "🚀 deploy: préparation déploiement Render"
        git push origin main
        echo "✅ Changements commités et poussés"
    else
        echo "❌ Déploiement annulé - Commitez vos changements d'abord"
        exit 1
    fi
fi

echo "✅ Git configuré correctement"

# Afficher les informations de déploiement
echo ""
echo "🚀 PRÊT POUR LE DÉPLOIEMENT !"
echo "============================="
echo ""
echo "📋 Configuration détectée :"
echo "   Repository: $(git remote get-url origin)"
echo "   Branch: $(git branch --show-current)"
echo "   Dernière commit: $(git log -1 --pretty=format:'%h - %s')"
echo ""

# Instructions pour Render
echo "🌐 ÉTAPES DE DÉPLOIEMENT SUR RENDER :"
echo "======================================"
echo ""
echo "1. 🔗 Ouvrir Render :"
echo "   https://render.com"
echo ""
echo "2. 🔑 Se connecter avec GitHub"
echo ""
echo "3. ➕ Créer un nouveau service :"
echo "   • Cliquez sur 'New +'"
echo "   • Sélectionnez 'Static Site'"
echo ""
echo "4. 🔗 Connecter le repository :"
echo "   • 'Connect a repository'"
echo "   • Cherchez 'AnarchyTask'"
echo "   • Cliquez 'Connect'"
echo ""
echo "5. ⚙️ Configuration (automatique via render.yaml) :"
echo "   • Name: anarchytasks"
echo "   • Branch: main"
echo "   • Build Command: npm install && npm run build"
echo "   • Publish Directory: ./dist"
echo ""
echo "6. 🚀 Déployer :"
echo "   • Cliquez 'Create Static Site'"
echo "   • Attendez 2-3 minutes"
echo "   • Votre révolution sera en ligne !"
echo ""

# URL finale
echo "🌍 VOTRE RÉVOLUTION SERA ACCESSIBLE SUR :"
echo "========================================="
echo "   https://anarchytasks.onrender.com"
echo "   (ou l'URL générée par Render)"
echo ""

# Message final
echo "🏴‍☠️ VIVE LA RÉVOLUTION NUMÉRIQUE !"
echo "=================================="
echo ""
echo "« L'anarchie numérique se propage dans le monde ! »"
echo ""
echo "📤 Partagez avec vos camarades :"
echo "   - Envoyez l'URL une fois déployée"
echo "   - Invitez-les à créer leurs comptes"
echo "   - Formez vos équipes anarchistes"
echo ""
echo "✊ La résistance technologique commence maintenant !"