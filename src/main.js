import { startCombat, initializeCombat } from './systems/combatSystem.js';

async function startGame() {
    // Déterminez le biome actuel, par exemple "Forest"
    const currentBiome = 'Foret';

    try {
        // Démarrer le combat et obtenir le monstre sélectionné
        const monster = await startCombat(currentBiome);

        // Initialiser le combat avec le monstre sélectionné
        initializeCombat(monster);
        
    } catch (error) {
        console.error('Erreur lors du démarrage du jeu:', error);
    }
}

// Appel de la fonction de démarrage du jeu
startGame();