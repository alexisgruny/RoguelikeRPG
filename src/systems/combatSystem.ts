import { Biome, Monster } from '../types'; // Import des types Biome et Monster
import { BiomeService } from '../components/biome'; // Service de gestion des biomes
import { MonsterService } from '../components/monsters'; // Service de gestion des monstres
import { HUD } from '../ui/HUD'; // Interface utilisateur pour les combats
import { RoleService, player } from '../components/role'; // Gestion des rôles et du joueur

export class CombatSystem {

    // Démarre le combat dans un biome donné
    public static async startCombat(biomeName: string): Promise<void> {
        try {
            // Charge les biomes et les monstres depuis les services respectifs
            const biomes = await BiomeService.loadBiomes();
            const monsters = await MonsterService.loadMonsters();
            const selectedClass = RoleService.getSelectedRole(); // Récupère la classe sélectionnée du joueur

            // Vérifie qu'une classe est bien sélectionnée
            if (!selectedClass) {
                throw new Error('No class selected for the player');
            }

            // Applique les attributs de la classe sélectionnée au joueur
            player.health = selectedClass.health;
            player.attack = selectedClass.attack;
            player.defense = selectedClass.defense;

            // Récupère les monstres disponibles dans le biome donné
            const availableMonsters = MonsterService.getMonstersFromBiome(biomes, biomeName, monsters);
            if (availableMonsters.length === 0) {
                throw new Error(`No monsters found for biome '${biomeName}'`);
            }

            // Sélectionne un monstre aléatoire parmi ceux disponibles
            const selectedMonster = MonsterService.selectRandomMonsters(availableMonsters, 1)[0];
            const selectedBiome = BiomeService.findBiomeByName(biomes, biomeName); // Trouve le biome correspondant

            // Si le biome est valide, initialise l'interface du combat
            if (selectedBiome) {
                HUD.initializeCombat(selectedMonster, selectedBiome);
            }

        } catch (error) {
            console.error('Erreur lors du démarrage du combat:', error); // Affiche l'erreur en console
            throw error; // Propage l'erreur pour la gestion ultérieure
        }
    }

    // Méthode d'attaque du joueur contre le monstre
    public static playerAttack(monster: Monster): { damageToMonster: number, monsterDefeated: boolean } {
        // Calcule les dégâts infligés au monstre (au moins 1 point de dégât)
        let damageToMonster = Math.max(player.attack - monster.defense, 1);
        monster.health -= damageToMonster; // Réduit la vie du monstre
        const monsterDefeated = monster.health <= 0; // Vérifie si le monstre est vaincu

        return { damageToMonster, monsterDefeated }; // Retourne les dégâts et l'état du monstre
    }

    // Méthode d'attaque du monstre contre le joueur
    public static monsterAttack(monster: Monster): { damageToPlayer: number, playerDefeated: boolean } {
        // Calcule les dégâts infligés au joueur (au moins 1 point de dégât)
        let damageToPlayer = Math.max(monster.attack - player.defense, 1);
        player.health -= damageToPlayer; // Réduit la vie du joueur
        const playerDefeated = player.health <= 0; // Vérifie si le joueur est vaincu

        return { damageToPlayer, playerDefeated }; // Retourne les dégâts et l'état du joueur
    }
}