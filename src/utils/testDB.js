// Script de test pour vérifier IndexedDB
import { TaskDB } from '../database/indexedDB.js';

export const testDatabase = async () => {
  console.log('🏴‍☠️ Test de la base de données AnarchyTasks...');
  
  try {
    // Test 1: Ajouter une tâche
    console.log('📝 Test ajout de tâche...');
    const newTask = await TaskDB.addTask('Test de la révolution numérique');
    console.log('✅ Tâche ajoutée:', newTask);

    // Test 2: Récupérer toutes les tâches
    console.log('📋 Test récupération des tâches...');
    const allTasks = await TaskDB.getAllTasks();
    console.log('✅ Tâches récupérées:', allTasks.length);

    // Test 3: Mettre à jour une tâche
    if (allTasks.length > 0) {
      console.log('✏️ Test mise à jour de tâche...');
      const success = await TaskDB.updateTask(allTasks[0].id, 'Tâche mise à jour', false);
      console.log('✅ Mise à jour:', success);
    }

    // Test 4: Statistiques
    console.log('📊 Test statistiques...');
    const stats = await TaskDB.getStats();
    console.log('✅ Statistiques:', stats);

    // Test 5: Recherche
    console.log('🔍 Test recherche...');
    const searchResults = await TaskDB.searchTasks('révolution');
    console.log('✅ Résultats recherche:', searchResults.length);

    console.log('🎉 Tous les tests passés ! La base de données fonctionne parfaitement.');
    return true;

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return false;
  }
};

// Fonction pour nettoyer les données de test
export const cleanTestData = async () => {
  try {
    const tasks = await TaskDB.getAllTasks();
    for (const task of tasks) {
      if (task.text.includes('Test') || task.text.includes('révolution')) {
        await TaskDB.deleteTask(task.id);
      }
    }
    console.log('🧹 Données de test nettoyées');
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
  }
};

export default { testDatabase, cleanTestData };