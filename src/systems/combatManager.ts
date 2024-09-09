import { Monster, Biome } from '../types';
import { CombatSystem } from './combatSystem';
import { HUD } from '../ui/HUD';
import { MonsterService } from '../components/monsters';
import { BiomeService } from '../components/biome';
import { RoleService, player } from '../components/role';

export class CombatManager {
    private static currentMonster: Monster | null = null;
    private static victoryCount: number = 0;
    private static maxVictories: number = 5;

    // Fonction principale pour démarrer le combat
    public static async startCombat(biomeName: string): Promise<void> {
        try {
            const biomes = await BiomeService.loadBiomes();
            const monsters = await MonsterService.loadMonsters();
            const selectedBiome = BiomeService.findBiomeByName(biomes, biomeName);
            const selectedClass = RoleService.getSelectedRole();

            if (!selectedClass) {
                throw new Error('No class selected for the player');
            }

            this.assignPlayerAttributes(selectedClass); // Applique les attributs de la classe sélectionnée au joueur

            // Lance le premier combat si le biome est trouvé
            if (selectedBiome) {
                this.startNextBattle(selectedBiome, monsters);
            }

        } catch (error) {
            console.error('Failed to start combat:', error);
        }
    }

    // Affecte les attributs de la classe sélectionnée au joueur
    private static assignPlayerAttributes(selectedClass: { health: number, attack: number, defense: number }): void {
        player.health = selectedClass.health;
        player.attack = selectedClass.attack;
        player.defense = selectedClass.defense;
    }

    // Lance la prochaine bataille avec un monstre du biome
    private static async startNextBattle(biome: Biome, monsters: Monster[]): Promise<void> {
        const availableMonsters = MonsterService.getMonstersFromBiome(biome, monsters);
        this.currentMonster = this.selectRandomMonster(availableMonsters);

        HUD.updatePlayerStats(); // Met à jour l'interface avec les stats du joueur
        HUD.updateMonsterStats(this.currentMonster); // Met à jour l'interface avec les stats du monstre

        this.setupAttack(biome); // Configure le bouton d'attaque
    }

    // Sélectionne un monstre aléatoire
    private static selectRandomMonster(monsters: Monster[]): Monster {
        return monsters[Math.floor(Math.random() * monsters.length)];
    }

    // Prépare le bouton d'attaque pour lancer le combat
    private static setupAttack(biome: Biome): void {
        const attackButton = document.getElementById('attack-button');
        if (attackButton) {
            attackButton.removeEventListener('click', this.handleAttackBound);// Nettoie les anciens écouteurs pour éviter les duplications
            this.handleAttackBound = this.handlePlayerAttack.bind(this, biome);// Associe le contexte du biome et la fonction d'attaque
            attackButton.addEventListener('click', this.handleAttackBound);// Ajoute l'écouteur d'événement
        }
    }

    // Garde une référence à l'écouteur pour pouvoir le supprimer
    private static handleAttackBound: (event: Event) => void;

    // Gère l'attaque du joueur et met à jour le combat
    private static handlePlayerAttack(biome: Biome): void {
        if (!this.currentMonster) return;

        const { damageToMonster, monsterDefeated } = CombatSystem.playerAttack(this.currentMonster);
        HUD.logAction(`Player attacks ${this.currentMonster.name} for ${damageToMonster} damage!`);

        if (monsterDefeated) {
            this.handleVictory(biome);
            this.currentMonster = null; // Réinitialise le monstre actuel
        } else {
            this.handleMonsterAttack(biome);
        }
    }

    // Gère l'attaque du monstre contre le joueur
    private static handleMonsterAttack(biome: Biome): void {
        if (!this.currentMonster) return;

        const { damageToPlayer, playerDefeated } = CombatSystem.monsterAttack(this.currentMonster);
        HUD.logAction(`${this.currentMonster.name} attacks for ${damageToPlayer} damage!`);

        if (playerDefeated) {
            HUD.showResult('defeat'); // Si le joueur est vaincu, afficher la défaite
        } else {
            HUD.updatePlayerStats(); // Sinon, mettre à jour les stats du joueur
        }
    }

    // Gère la victoire du joueur et enchaîne sur le prochain combat
    private static async handleVictory(biome: Biome): Promise<void> {
        this.victoryCount++;
        if (this.victoryCount >= this.maxVictories) {
            HUD.showResult('final-victory'); // Si le joueur atteint le maximum de victoires
        } else {
            const monsters = await MonsterService.loadMonsters();
            this.startNextBattle(biome, monsters); // Lance la prochaine bataille
        }
    }
}