#!/usr/bin/env node

// Script de déploiement automatique sur Render
// Guide pour déploiement manuel

import https from 'https';
import fs from 'fs';

console.log('🏴‍☠️ Déploiement automatique sur Render...');

// Configuration du service
const serviceConfig = {
  type: 'static_site',
  name: 'anarchytasks-revolution',
  repo: 'https://github.com/UNionlibertaireAnarchiste-org/AnarchyTask.git',
  branch: 'main',
  buildCommand: 'npm install && npm run build',
  publishPath: './dist',
  pullRequestPreviewsEnabled: true,
  headers: [
    {
      path: '/*',
      name: 'X-Frame-Options',
      value: 'DENY'
    },
    {
      path: '/*', 
      name: 'X-Content-Type-Options',
      value: 'nosniff'
    }
  ],
  routes: [
    {
      type: 'rewrite',
      source: '/*',
      destination: '/index.html'
    }
  ]
};

console.log('📋 Configuration du service :');
console.log(JSON.stringify(serviceConfig, null, 2));

console.log('\n🚀 Pour déployer sur Render :');
console.log('1. Allez sur https://render.com');
console.log('2. Connectez-vous avec GitHub');
console.log('3. New + → Static Site');
console.log('4. Sélectionnez le repo : UNionlibertaireAnarchiste-org/AnarchyTask');
console.log('5. Render détectera automatiquement render.yaml');
console.log('6. Cliquez "Create Static Site"');

console.log('\n✅ Configuration automatique :');
console.log('   Name: anarchytasks');
console.log('   Build: npm install && npm run build');
console.log('   Publish: ./dist');
console.log('   Branch: main');

console.log('\n🌍 Votre révolution sera accessible sur :');
console.log('   https://anarchytasks.onrender.com');

console.log('\n🏴‍☠️ Vive la révolution numérique !');