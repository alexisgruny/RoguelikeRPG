import { Biome, Monster } from '../types';

export class MonsterService {
    // Charge les informations du fichier monsters.json
    public static async loadMonsters(): Promise<Monster[]> {
        const response = await fetch('/data/monsters.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Monster[];
    }

    // Récupère les monstres d'un biome
    public static getMonstersFromBiome(biomes: Biome[], biomeName: string, monsters: Monster[]): Monster[] {
        const currentBiome = biomes.find(biome => biome.name === biomeName);
        if (!currentBiome) {
            throw new Error(`Biome '${biomeName}' not found`);
        }
        return monsters.filter(monster => currentBiome.monsters.includes(monster.name));
    }

    // Sélectionne des monstres aléatoires
    public static selectRandomMonsters(monsters: Monster[], numberOfMonsters: number = 1): Monster[] {
        return Array.from({ length: numberOfMonsters }, () => {
            const randomIndex = Math.floor(Math.random() * monsters.length);
            return monsters[randomIndex];
        });
    }
}