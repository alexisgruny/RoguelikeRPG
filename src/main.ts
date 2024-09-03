import { startCombat, initializeCombat } from './systems/combatSystem';

async function main() {
    try {
        const currentBiome = 'Foret'; // Exemple de nom de biome
        const selectedMonster = await startCombat(currentBiome);
        initializeCombat(selectedMonster);
    } catch (error) {
        console.error('Erreur dans le main:', error);
    }
}

main();