import { AppData } from '../data/appData';
import { Biome, Monster } from '../types';

export class MonsterService {

    // Récupère les monstres associés à un biome spécifique
    public static getMonstersFromBiome(biome: Biome): Monster[]{
        const monsters = AppData.monsters;
        const currentBiome = biome; // `biome` est déjà le biome actuel, pas besoin de chercher
        return monsters.filter(monster => currentBiome.monsters.includes(monster.name)&& monster.boss === false);
    }

    public static selectBossFromBiome(monsters: Monster[]){
        const bosses = monsters.filter(monsters => monsters.boss === true);// Filtrer les monstres du biome actuel qui sont des boss
        if (bosses.length > 0) {// Si un boss est trouvé, retourner le premier boss trouvé, sinon retourner un monstre par défaut
            return bosses[0]; // Sélectionne le premier boss dans la liste
        } else {
            throw new Error('Aucun boss trouvé dans ce biome');
        }
    }
    
    // Sélectionne des monstres aléatoires (sans répétition)
    public static selectRandomMonsters(monsters: Monster[], numberOfMonsters: number){
        const shuffledMonsters = [...monsters]; // Crée une copie des monstres pour éviter de modifier l'original
        for (let i = shuffledMonsters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledMonsters[i], shuffledMonsters[j]] = [shuffledMonsters[j], shuffledMonsters[i]]; // Mélange le tableau
        }
        return shuffledMonsters.slice(0, numberOfMonsters); // Prend les premiers éléments après le mélange
    }
    
    public static applyDifficultyScaling(monster: Monster, battleCount: number): Monster {
        const difficultyFactor = 0.05; // Ajuste ce facteur pour moduler la difficulté
        const scale = 1 + difficultyFactor * Math.sqrt(battleCount);
    
        return {
            ...monster,
            health: Number(Math.floor(monster.health * scale)),
            attack: Number(Math.floor(monster.attack * scale)),
            defense: Number(Math.floor(monster.defense * scale)),
        };
    }
}
