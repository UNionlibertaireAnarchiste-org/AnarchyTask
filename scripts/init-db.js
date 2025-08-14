#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏴‍☠️ Initialisation de la base de données AnarchyTasks...');

try {
  // Créer le dossier de base de données s'il n'existe pas
  const dbDir = path.join(__dirname, '../src/database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Créer la base de données
  const dbPath = path.join(__dirname, '../anarchytasks.db');
  const db = new Database(dbPath);

  console.log('📁 Base de données créée:', dbPath);

  // Activer les clés étrangères
  db.pragma('foreign_keys = ON');

  // Créer la table des tâches
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createTasksTable);
  console.log('✅ Table "tasks" créée');

  // Créer un trigger pour mettre à jour updated_at
  const createUpdateTrigger = `
    CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp 
    AFTER UPDATE ON tasks
    BEGIN
      UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `;

  db.exec(createUpdateTrigger);
  console.log('✅ Trigger de mise à jour créé');

  // Ajouter quelques tâches d'exemple (optionnel)
  const insertExampleTasks = `
    INSERT OR IGNORE INTO tasks (id, text, completed) VALUES 
    (1, 'Organiser ma révolution personnelle', 0),
    (2, 'Lire le manifeste anarchiste', 1),
    (3, 'Contribuer à des projets open source', 0),
    (4, 'Partager AnarchyTasks avec des rebelles', 0)
  `;

  db.exec(insertExampleTasks);
  console.log('✅ Tâches d\'exemple ajoutées');

  // Vérifier que tout fonctionne
  const count = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
  console.log(`📊 Nombre de tâches dans la base: ${count.count}`);

  db.close();
  console.log('🎉 Base de données initialisée avec succès !');
  console.log('🔥 Votre révolution numérique peut commencer !');

} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation:', error);
  process.exit(1);
}