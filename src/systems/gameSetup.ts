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
    public static currentBiome: Biome;
    private static victoryCount: number = 0;
    public static combatCount: number = 0;
    private static biomeDoneCount: number = 0;
    private static handleAttackBound: (event: Event) => void = () => { };

    public static initializeGame() {
        try {
            Menu.initialize();
        } catch (error) {
            console.error('Error loading startup:', error);
        }
    }

    public static startNextCombat(biome: Biome) {
        this.combatCount++;
        this.currentBiome = biome;
        this.currentMonster = this.getRandomMonster();
        this.currentMonster = MonsterService.applyDifficultyScaling(this.currentMonster, this.combatCount);
        HUD.updateMonsterStats(this.currentMonster);
        HUD.changeLevelDisplay();
        this.setupAttackButtons();
    }

    private static getRandomMonster(): Monster {
        const availableMonsters = MonsterService.getMonstersFromBiome(this.currentBiome);
        const randomMonster = MonsterService.selectRandomMonsters(availableMonsters, 1)[0];
        return JSON.parse(JSON.stringify(randomMonster)); // Création d'un clone en profondeur
    }

    private static setupAttackButtons() {
        const attackButton = document.getElementById('attack-button');
        const skillButton = document.getElementById('info-list');

        if (attackButton) {
            // Supprime tout ancien écouteur pour éviter les doublons
            if (this.handleAttackBound) {
                attackButton.removeEventListener('click', this.handleAttackBound);
            }
            // Lie et ajoute un nouvel écouteur
            this.handleAttackBound = this.handlePlayerAttack.bind(this);
            attackButton.addEventListener('click', this.handleAttackBound);
        }

        if (skillButton) {
            skillButton.removeEventListener('click', this.handleSkillButtonClick);
            skillButton.addEventListener('click', this.handleSkillButtonClick.bind(this));
        }
    }

    private static handleSkillButtonClick(event: Event) {
        const skillElement = event.target as HTMLElement;
        if (skillElement && skillElement.tagName === 'BUTTON') {
            const skillId = skillElement.getAttribute('data-id');
            console.log('Skill button clicked. ID:', skillId);
        }
    }

    private static handlePlayerAttack() {
        if (!this.currentMonster) return;
        CombatSystem.playerAttack(this.currentMonster);
    }

    public static handleMonsterAttack() {
        if (this.currentMonster) {
            CombatSystem.monsterAttack(this.currentMonster);
        }
    }

    public static async handleVictory() {
        this.victoryCount++;
        let eventType: 'end' | 'heal' | 'boss' | 'biomeChange' | 'item' | 'victory' | null = null;
        let isBossBattle = false;

        PlayerStatsService.addExperience();

        switch (this.victoryCount) {
            case 1:
            case 3:
            case 7:
                eventType = 'item';
                await ItemService.chooseItem(this.victoryCount);
                break;
            case 5:
                eventType = 'heal';
                PlayerStatsService.campFire();
                break;
            case 9:
                eventType = 'boss';
                isBossBattle = true;
                break;
            case 10:
                if (this.biomeDoneCount === 5) {
                    eventType = 'end';
                } else {
                    eventType = 'biomeChange'; 
                    this.biomeDoneCount++;
                    this.victoryCount = 0;
                    Menu.showBiomeMenu();
                }
                break;
            default:
                eventType = 'victory';
                break;
        }

        if (eventType) {
        }
        // Condition pour choisir entre le combat contre un boss ou un monstre normal
        if (isBossBattle) {
            this.startBossBattle();
        } else {
            this.startNextCombat(this.currentBiome);
        }
    }

    private static startBossBattle() {
        const boss = MonsterService.selectBossFromBiome(AppData.monsters);
        this.currentMonster = boss;
        HUD.updateMonsterStats(this.currentMonster);
        this.setupAttackButtons(); // Réattacher les boutons
    }

    public static chooseAbility(monster: Monster) {
        const roll = Math.random();
        let cumulativeProb = 0;
        for (const ability of monster.abilities) {
            cumulativeProb += ability.probabilities;
            if (roll <= cumulativeProb) return ability;
        }
        return null;
    }
}
