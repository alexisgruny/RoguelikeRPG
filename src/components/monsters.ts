import { Biome, Monster } from '../types';

export class MonsterService {

    // Charge les informations depuis un fichier JSON contenant les monstres
    public static async loadMonsters(): Promise<Monster[]> {
        try {
            const response = await fetch('/data/monsters.json');
            if (!response.ok) {
                throw new Error(`Failed to load monsters: ${response.statusText}`);
            }
            return await response.json() as Monster[];
        } catch (error) {
            console.error("Error loading monsters:", error);
            throw error;
        }
    }

    // Récupère les monstres associés à un biome spécifique
    public static getMonstersFromBiome(biome: Biome, monsters: Monster[]): Monster[] {
        const currentBiome = biome; // `biome` est déjà le biome actuel, pas besoin de chercher
        return monsters.filter(monster => currentBiome.monsters.includes(monster.name)&& monster.boss === false);
    }

    public static selectBossFromBiome(biome: Biome, monsters: Monster[]): Monster {
        const currentBiome = biome; // Utilise le biome actuel
        const bosses = monsters.filter(monster => currentBiome.monsters.includes(monster.name) && monster.boss === true);// Filtrer les monstres du biome actuel qui sont des boss
        if (bosses.length > 0) {// Si un boss est trouvé, retourner le premier boss trouvé, sinon retourner un monstre par défaut
            return bosses[0]; // Sélectionne le premier boss dans la liste
        } else {
            throw new Error('Aucun boss trouvé dans ce biome');
        }
    }
    

    // Sélectionne des monstres aléatoires (sans répétition)
    public static selectRandomMonsters(monsters: Monster[], numberOfMonsters: number = 1): Monster[] {
        const shuffledMonsters = [...monsters]; // Crée une copie des monstres pour éviter de modifier l'original
        for (let i = shuffledMonsters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledMonsters[i], shuffledMonsters[j]] = [shuffledMonsters[j], shuffledMonsters[i]]; // Mélange le tableau
        }
        return shuffledMonsters.slice(0, numberOfMonsters); // Prend les premiers éléments après le mélange
    }
}
