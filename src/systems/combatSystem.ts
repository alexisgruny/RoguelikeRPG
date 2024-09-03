import { Biome, Monster } from '../types';
import { loadBiomes, findBiomeByName } from '../components/biome';
import { loadMonsters, getMonstersFromBiome, selectRandomMonsters } from '../components/monsters';
import { initializeCombat } from '../ui/hud'; // Moved to HUD.ts

export async function startCombat(biomeName: string): Promise<void> {
    try {
        // Charger les biomes et les monstres
        const biomes = await loadBiomes();
        const monsters = await loadMonsters();

        // Obtenir les monstres pour le biome actuel
        const availableMonsters = getMonstersFromBiome(biomes, biomeName, monsters);
        if (availableMonsters.length === 0) {
            throw new Error(`No monsters found for biome '${biomeName}'`);
        }

        // Sélectionner un monstre aléatoire pour le combat
        const selectedMonster = selectRandomMonsters(availableMonsters, 1)[0];
        const selectedBiome = findBiomeByName(biomes, biomeName) as Biome;

        // Initialiser le combat
        initializeCombat(selectedMonster, selectedBiome);
    } catch (error) {
        console.error('Erreur lors du démarrage du combat:', error);
        throw error;
    }
}

