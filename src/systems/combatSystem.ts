import { Biome, Monster } from '../types';
import { BiomeService } from '../components/biome';
import { MonsterService } from '../components/monsters';
import { HUD } from '../ui/HUD';
import { ClasseService, player } from '../components/classe';

export class CombatSystem {
    public static async startCombat(biomeName: string): Promise<void> {
        try {
            const biomes = await BiomeService.loadBiomes();
            const monsters = await MonsterService.loadMonsters();
            const selectedClass = ClasseService.getSelectedClass();

            if (!selectedClass) {
                throw new Error('No class selected for the player');
            }

            // Appliquer les attributs de la classe sélectionnée au joueur
            player.health = selectedClass.health;
            player.attack = selectedClass.attack;
            player.defense = selectedClass.defense;

            const availableMonsters = MonsterService.getMonstersFromBiome(biomes, biomeName, monsters);
            if (availableMonsters.length === 0) {
                throw new Error(`No monsters found for biome '${biomeName}'`);
            }

            const selectedMonster = MonsterService.selectRandomMonsters(availableMonsters, 1)[0];
            const selectedBiome = BiomeService.findBiomeByName(biomes, biomeName);

            if (selectedBiome) {
                HUD.initializeCombat(selectedMonster, selectedBiome);
            }

        } catch (error) {
            console.error('Erreur lors du démarrage du combat:', error);
            throw error;
        }
    }

    public static playerAttack(monster: Monster): { damageToMonster: number, monsterDefeated: boolean } {
        let damageToMonster = Math.max(player.attack - monster.defense, 1);
        monster.health -= damageToMonster;
        const monsterDefeated = monster.health <= 0;

        return { damageToMonster, monsterDefeated };
    }

    public static monsterAttack(monster: Monster): { damageToPlayer: number, playerDefeated: boolean } {
        let damageToPlayer = Math.max(monster.attack - player.defense, 1);
        player.health -= damageToPlayer;
        const playerDefeated = player.health <= 0;

        return { damageToPlayer, playerDefeated };
    }
}