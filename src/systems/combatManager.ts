import { Monster, Biome } from '../types';
import { CombatSystem } from './combatSystem';
import { HUD } from '../ui/HUD';
import { MonsterService } from '../components/monsters';
import { BiomeService } from '../components/biome';
import { RoleService } from '../components/role';
import { player } from '../components/role';

export class CombatManager {
    private static currentMonster: Monster | null = null;
    private static victoryCount: number = 0;
    private static maxVictories: number = 5;

    public static async startCombat(biomeName: string): Promise<void> {
        const biomes = await BiomeService.loadBiomes();
        const monsters = await MonsterService.loadMonsters();
        const selectedBiome = BiomeService.findBiomeByName(biomes, biomeName);
        const selectedClass = RoleService.getSelectedRole();

            // Vérifie qu'une classe est bien sélectionnée
            if (!selectedClass) {
                throw new Error('No class selected for the player');
            }

            // Applique les attributs de la classe sélectionnée au joueur
            player.health = selectedClass.health;
            player.attack = selectedClass.attack;
            player.defense = selectedClass.defense;

        if (selectedBiome) {
            this.startNextBattle(selectedBiome, monsters);
        }
    }

    private static async startNextBattle(biome: Biome, monsters: Monster[]): Promise<void> {
        const availableMonsters = MonsterService.getMonstersFromBiome(biome, monsters);
        this.currentMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
    
        HUD.updatePlayerStats();
        HUD.updateMonsterStats(this.currentMonster);
        this.setupAttack(biome);
    }

    private static setupAttack(biome: Biome) {
        const attackButton = document.getElementById('attack-button');
    
        if (attackButton) {
            // Supprime l'écouteur d'événement existant s'il est présent
            attackButton.removeEventListener('click', this.handleAttackBound);
    
            // Lie correctement le contexte pour pouvoir le retirer plus tard
            this.handleAttackBound = this.handlePlayerAttack.bind(this, biome);
    
            // Ajoute le nouvel écouteur d'événement
            attackButton.addEventListener('click', this.handleAttackBound);
        }
    }
    
    // Déclaration d'une propriété pour conserver la référence de la fonction liée
    private static handleAttackBound: (event: Event) => void;

    private static handlePlayerAttack(biome: Biome) {
        if (!this.currentMonster) return;

        const { damageToMonster, monsterDefeated } = CombatSystem.playerAttack(this.currentMonster);
        HUD.logAction(`Player attacks ${this.currentMonster.name} for ${damageToMonster} damage!`);

        if (monsterDefeated) {
            this.handleVictory(biome);
            this.currentMonster = null;
        } else {
            this.handleMonsterAttack(biome);
        }
    }

    private static handleMonsterAttack(biome: Biome) {
        if (!this.currentMonster) return;

        const { damageToPlayer, playerDefeated } = CombatSystem.monsterAttack(this.currentMonster);
        HUD.logAction(`${this.currentMonster.name} attacks for ${damageToPlayer} damage!`);

        if (playerDefeated) {
            HUD.showResult('defeat');
        } else {
            HUD.updatePlayerStats();
        }
    }

    private static async handleVictory(biome: Biome): Promise<void> {
        this.victoryCount++;
        if (this.victoryCount >= this.maxVictories) {
            HUD.showResult('final-victory');
        } else {
            const monsters = await MonsterService.loadMonsters();
            this.startNextBattle(biome, monsters);
        }
    }
}