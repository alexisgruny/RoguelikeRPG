import { Biome, Monster } from '../types';

// Charge les informations du fichier monsters.json
export async function loadMonsters(): Promise<Monster[]> {
    const response = await fetch('/data/monsters.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Monster[];
}

// Récupère les monstres du biome actuel
export function getMonstersFromBiome(biomes: Biome[], biomeName: string, monsters: Monster[]): Monster[] {
    const currentBiome = biomes.find(biome => biome.name === biomeName);
    if (!currentBiome) {
       throw new Error(`Biome '${biomeName}' not found`);
    }
    return monsters.filter(monster =>
        currentBiome.monsters.includes(monster.name)
    );
}

// Sélectionne un ou plusieurs monstres aléatoires parmi ceux disponibles dans le biome actuel
export function selectRandomMonsters(monsters: Monster[], numberOfMonsters: number = 1): Monster[] {
    const selectedMonsters: Monster[] = [];
    for (let i = 0; i < numberOfMonsters; i++) {
        const randomIndex = Math.floor(Math.random() * monsters.length);
        selectedMonsters.push(monsters[randomIndex]);
    }
    return selectedMonsters;
}