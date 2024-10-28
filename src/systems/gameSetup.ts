import { Biome, Monster } from "types";
import { Menu } from '../ui/menu';
import { MonsterService } from "../service/monsterService";
import { HUD } from "../ui/HUD";
import { PlayerStatsService } from "../service/playerManagerService";
import { CombatSystem } from "./combatSystem";
import { ItemService } from "../service/itemService";
import { AppData } from "../data/appData";

export class GameInitializer {

    public static currentMonster: Monster | null = null;
    public static currentBiome: Biome ;
    private static victoryCount: number = 0;
    private static biomeDoneCount: number = 0;
    private static handleAttackBound: (event: Event) => void; // Garde une référence à l'écouteur d'événements

    public static InitialyzeGame() {
        try {
            Menu.playButton();
        } catch {
            console.log('error loading startup');
        }
    }

    public static startNextCombat(currentBiome: Biome) {
        PlayerStatsService.initializePlayerStats();
        this.currentBiome = currentBiome
        const availableMonsters = MonsterService.getMonstersFromBiome(currentBiome);
        this.currentMonster = MonsterService.selectRandomMonsters(availableMonsters, 1)[0];
        HUD.updateMonsterStats(this.currentMonster); // Met à jour les stats du monstre

        this.setupAttack(); // Configure le bouton d'attaque
    }

    // Prépare le bouton d'attaque
    private static setupAttack(){
        const attackButton = document.getElementById('attack-button');
        const skillButton = document.getElementById('info-list')
        if (attackButton) {
            attackButton.removeEventListener('click', this.handleAttackBound); // Retire l'ancien événement
            this.handleAttackBound = this.handlePlayerAttack.bind(this);
            attackButton.addEventListener('click', this.handleAttackBound); // Associe l'événement
        }
        if (skillButton) {
            skillButton.addEventListener('click', (event) => {
                const skillActif = event?.target as HTMLElement;

                if (skillActif && skillActif.tagName === 'BUTTON') {
                    const skillId = skillActif.getAttribute('data-id');
                    console.log('bouton cliqué ID : ', skillId);
                }
            });
        }
    }

    // Gère l'attaque du joueur et met à jour le combat
    private static handlePlayerAttack(){
        HUD.logRemove();
        if (!this.currentMonster) return;

        const { damageToMonster, monsterDefeated } = CombatSystem.playerAttack(this.currentMonster);
        HUD.logAction(`Player attacks ${this.currentMonster.name} for ${damageToMonster} damage!`);

        if (monsterDefeated) {
            this.handleVictory();
            HUD.logAction(`${this.currentMonster.name} est MORT !`);
            this.currentMonster = null;

        } else {
            this.handleMonsterAttack();
        }
    }

    private static handleMonsterAttack(){
        if (!this.currentMonster) return;
        CombatSystem.monsterAttack(this.currentMonster);
    }

    // Gère la victoire du joueur et enchaîne sur le prochain combat
    private static async handleVictory(){
        this.victoryCount++;
        let eventType: 'end' | 'heal' | 'boss' | 'change biome' | 'item' | 'victory' |null = null;
        let isBossBattle = false;
        PlayerStatsService.addExperience();

        // Utilisation d'un switch pour déterminer l'événement en fonction des victoires ou événements
        switch (this.victoryCount) {

            case 1:
                eventType = 'item'
                ItemService.chooseItem(this.victoryCount);
                break;
            case 3:
                eventType = 'item'
                ItemService.chooseItem(this.victoryCount);
                break;
            case 5:
                PlayerStatsService.campFire(); // Soin du joueur lors de l'événement du feu de camp
                eventType = 'heal'; // Événement de guérison
                break;
            case 7:
                eventType = 'item'
                ItemService.chooseItem(this.victoryCount);
                break;
            case 9:
                isBossBattle = true; // Le 10e combat est contre un boss
                eventType = 'boss'; // Spécifie que c'est un combat de boss
                break;
            case 10:
                if (this.biomeDoneCount === 5) {
                    eventType = 'end';
                } else {
                    eventType = 'change biome'; // Victoire finale
                    this.biomeDoneCount++;
                    this.victoryCount = 0;
                }
                break;

            default:
                eventType = 'victory'
                break;
        }

        if (eventType) {
            HUD.showEventModal(eventType); // Affiche le bon modal selon l'événement
        }

        // Sélection du prochain monstre : si c'est un combat de boss, on sélectionne un boss du biome
        const monsters = AppData.monsters;
        if (isBossBattle) {
            this.startBossBattle(monsters); // Lance la bataille contre un boss
        } else {
            GameInitializer.startNextCombat(this.currentBiome); // Lance la prochaine bataille contre un monstre normal
        }
    }

    // Fonction pour lancer un combat contre un boss
    private static startBossBattle(monsters: Monster[]): void {
        const boss = MonsterService.selectBossFromBiome(monsters); // Sélectionne un boss du biome
        this.currentMonster = boss;
        HUD.updateMonsterStats(this.currentMonster); // Met à jour les stats du boss
        this.setupAttack(); // Configure le bouton d'attaque
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