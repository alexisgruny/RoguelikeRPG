import { Monster, Biome } from '../types';
import { CombatSystem } from './combatSystem';
import { HUD } from '../ui/HUD';
import { MonsterService } from '../components/monsters';
import { BiomeService } from '../components/biome';
import { RoleService } from '../components/role';
import { PlayerStatsService } from '../systems/playerStatsManager';


export class CombatManager {
    private static currentMonster: Monster | null = null;
    private static victoryCount: number = 0;
    private static maxVictories: number = 10;
    private static EvenementCount: number = 0;
    private static handleAttackBound: (event: Event) => void; // Garde une référence à l'écouteur d'événements

    // Fonction principale pour démarrer le combat
    public static async InitialyzeGame(biomeName: string): Promise<void> {
        try {
            const [biomes, monsters] = await Promise.all([BiomeService.loadBiomes(), MonsterService.loadMonsters()]);
            const selectedBiome = BiomeService.findBiomeByName(biomes, biomeName);

            if (!selectedBiome) throw new Error(`Biome '${biomeName}' non trouvé`);

            PlayerStatsService.initializePlayerStats();
            this.updateHUD();

            // Lance la première bataille
            this.startNextBattle(selectedBiome, monsters);
        } catch (error) {
            console.error('Failed to start combat:', error);
        }
    }

    // Met à jour le HUD avec les stats du joueur
    private static updateHUD(): void {
        const { health, maxHealth, attack, defense } = PlayerStatsService.getPlayerStats();
        HUD.updatePlayerStats(health, maxHealth, attack, defense);
    }

    // Lance la prochaine bataille avec un monstre du biome
    private static async startNextBattle(biome: Biome, monsters: Monster[]): Promise<void> {
        const availableMonsters = MonsterService.getMonstersFromBiome(biome, monsters);
        if (!availableMonsters.length) throw new Error(`Aucun monstre trouvé dans le biome '${biome.name}'`);

        this.currentMonster = MonsterService.selectRandomMonsters(availableMonsters, 1)[0];
        this.updateHUD(); // Met à jour les stats du joueur
        HUD.updateMonsterStats(this.currentMonster); // Met à jour les stats du monstre

        this.setupAttack(biome); // Configure le bouton d'attaque
    }

    // Prépare le bouton d'attaque
    private static setupAttack(biome: Biome): void {
        const attackButton = document.getElementById('attack-button');
        if (attackButton) {
            attackButton.removeEventListener('click', this.handleAttackBound); // Retire l'ancien événement
            this.handleAttackBound = this.handlePlayerAttack.bind(this, biome);
            attackButton.addEventListener('click', this.handleAttackBound); // Associe l'événement
        }
    }

    // Gère l'attaque du joueur et met à jour le combat
    private static handlePlayerAttack(biome: Biome): void {
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

    // Gère l'attaque du monstre contre le joueur
    private static handleMonsterAttack(biome: Biome): void {
        if (!this.currentMonster) return;

        const { damageToPlayer, playerDefeated } = CombatSystem.monsterAttack(this.currentMonster);
        HUD.logAction(`${this.currentMonster.name} attacks for ${damageToPlayer} damage!`);

        PlayerStatsService.updatePlayerHealth(-damageToPlayer); // Met à jour la santé du joueur
        this.updateHUD(); // Met à jour les stats du joueur après les dégâts

        if (playerDefeated) {
            HUD.showModal('defeat'); // Affiche la défaite si le joueur est vaincu
        }
    }

    // Gère la victoire du joueur et enchaîne sur le prochain combat
    private static async handleVictory(biome: Biome): Promise<void> {
        this.victoryCount++;
        this.EvenementCount++;

        if (this.victoryCount >= this.maxVictories) {
            HUD.showModal('final-victory'); // Affiche la victoire finale
        } else if (this.EvenementCount === 5) {
            this.EvenementCount = 0;
            PlayerStatsService.campFire();// evenement qui soigne le joueur
            HUD.showModal('heal'); 
            const monsters = await MonsterService.loadMonsters();
            this.startNextBattle(biome, monsters); 
        } else {
            const monsters = await MonsterService.loadMonsters();
            this.startNextBattle(biome, monsters); // Lance la prochaine bataille
        }
    }
}