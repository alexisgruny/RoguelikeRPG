import { Monster, Biome, PlayerStats } from '../types';
import { CombatSystem } from './combatSystem';
import { HUD } from '../ui/HUD';
import { MonsterService } from '../components/monsters';
import { BiomeService } from '../components/biome';
import { RoleService } from '../components/role';
import { PlayerStatsService } from '../systems/playerStatsManager';
import { EquipementService } from '../components/item';


export class CombatManager {
    public static currentMonster: Monster | null = null;
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
        const playerStats = PlayerStatsService.getPlayerStats();
        HUD.updatePlayerStats(playerStats);
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
        const skillButton = document.getElementById('info-list')
        if (attackButton) {
            attackButton.removeEventListener('click', this.handleAttackBound); // Retire l'ancien événement
            this.handleAttackBound = this.handlePlayerAttack.bind(this, biome);
            attackButton.addEventListener('click', this.handleAttackBound); // Associe l'événement
        }
        if (skillButton) {
            const skill = PlayerStatsService.playerSkills;
            skillButton.addEventListener('click', (event) =>{
            const skillActif = event?.target as HTMLElement;

            if(skillActif && skillActif.tagName === 'BUTTON'){
                const skillId = skillActif.getAttribute('data-id');
                console.log('bouton cliqué ID : ', skillId);
            }
        });
    }
    }

    // Gère l'attaque du joueur et met à jour le combat
    private static handlePlayerAttack(biome: Biome): void {
        HUD.logRemove();
        if (!this.currentMonster) return;

        const { damageToMonster, monsterDefeated } = CombatSystem.playerAttack(this.currentMonster);
        HUD.logAction(`Player attacks ${this.currentMonster.name} for ${damageToMonster} damage!`);

        if (monsterDefeated) {
            this.handleVictory(biome);
            HUD.logAction(`${this.currentMonster.name} est MORT !`);
            this.currentMonster = null;
            
        } else {
            this.handleMonsterAttack(biome);
        }
    }

    // Gère l'attaque du monstre contre le joueur
    private static handleMonsterAttack(biome: Biome): void {
        if (!this.currentMonster) return;
        CombatSystem.monsterAttack(this.currentMonster);
    }

    // Gère la victoire du joueur et enchaîne sur le prochain combat
    private static async handleVictory(biome: Biome): Promise<void> {
        this.victoryCount++;
        let eventType: 'end' | 'heal' | 'boss' | null = null;
        let isBossBattle = false;
        PlayerStatsService.addExperience();
        EquipementService.chooseEquipement(this.victoryCount);

        // Utilisation d'un switch pour déterminer l'événement en fonction des victoires ou événements
        switch (true) {
            case (this.victoryCount >= this.maxVictories):
                eventType = 'end'; // Victoire finale
                break;
            case (this.victoryCount === 9):
                isBossBattle = true; // Le 10e combat est contre un boss
                eventType = 'boss'; // Spécifie que c'est un combat de boss
                break;
            case (this.victoryCount === 5):
                this.EvenementCount = 0;
                PlayerStatsService.campFire(); // Soin du joueur lors de l'événement du feu de camp
                eventType = 'heal'; // Événement de guérison
                break;
            default:
                break;
        }

        if (eventType) {
            HUD.showEventModal(eventType); // Affiche le bon modal selon l'événement
        }

        // Sélection du prochain monstre : si c'est un combat de boss, on sélectionne un boss du biome
        const monsters = await MonsterService.loadMonsters();
        if (isBossBattle) {
            this.startBossBattle(biome, monsters); // Lance la bataille contre un boss
        } else {
            this.startNextBattle(biome, monsters); // Lance la prochaine bataille contre un monstre normal
        }
    }

    // Fonction pour lancer un combat contre un boss
    private static startBossBattle(biome: Biome, monsters: Monster[]): void {
        const boss = MonsterService.selectBossFromBiome(biome, monsters); // Sélectionne un boss du biome
        this.currentMonster = boss;
        HUD.updateMonsterStats(this.currentMonster); // Met à jour les stats du boss
        this.setupAttack(biome); // Configure le bouton d'attaque
    }

    public static chooseAbility(monster: Monster) {
        const roll = Math.random();
        let cumulativeProb = 0;
        for (const ability of monster.abilities) {
            cumulativeProb += ability.probabilities;
            if (roll <= cumulativeProb) {
                return ability;
            }
        }
        return null; // Aucun pouvoir choisi (cas rare)
    }
}