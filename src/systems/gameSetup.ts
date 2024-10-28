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
    private static biomeDoneCount: number = 0;
    private static handleAttackBound: (event: Event) => void;

    public static initializeGame() {
        try {
            Menu.initialize();
        } catch (error) {
            console.error('Error loading startup:', error);
        }
    }

    public static startNextCombat(biome: Biome) {
        PlayerStatsService.initializePlayerStats();
        this.currentBiome = biome;
        this.currentMonster = this.getRandomMonster(biome);
        HUD.updateMonsterStats(this.currentMonster);
        this.setupAttackButtons();
    }

    private static getRandomMonster(biome: Biome): Monster {
        const availableMonsters = MonsterService.getMonstersFromBiome(biome);
        return MonsterService.selectRandomMonsters(availableMonsters, 1)[0];
    }

    private static setupAttackButtons() {
        const attackButton = document.getElementById('attack-button');
        const skillButton = document.getElementById('info-list');

        if (attackButton) {
            attackButton.removeEventListener('click', this.handleAttackBound);
            this.handleAttackBound = this.handlePlayerAttack.bind(this);
            attackButton.addEventListener('click', this.handleAttackBound);
        }

        if (skillButton) {
            skillButton.addEventListener('click', this.handleSkillButtonClick);
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
        HUD.clearLogs();
        if (!this.currentMonster) return;

        const { damageToMonster, monsterDefeated } = CombatSystem.playerAttack(this.currentMonster);
        HUD.logAction(`Player attacks ${this.currentMonster.name} for ${damageToMonster} damage!`);

        if (monsterDefeated) {
            this.handleVictory();
            HUD.logAction(`${this.currentMonster.name} is DEAD!`);
            this.currentMonster = null;
        } else {
            this.handleMonsterAttack();
        }
    }

    private static handleMonsterAttack() {
        if (this.currentMonster) {
            CombatSystem.monsterAttack(this.currentMonster);
        }
    }

    private static async handleVictory() {
        this.victoryCount++;
        let eventType: 'end' | 'heal' | 'boss' | 'change biome' | 'item' | 'victory' | null = null;
        let isBossBattle = false;

        PlayerStatsService.addExperience();

        switch (this.victoryCount) {
            case 1:
            case 3:
            case 7:
                eventType = 'item';
                ItemService.chooseItem(this.victoryCount);
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
                    eventType = 'change biome';
                    this.biomeDoneCount++;
                    this.victoryCount = 0;
                }
                break;
            default:
                eventType = 'victory';
                break;
        }

        if (eventType) {
            HUD.showEventModal(eventType);
        }

        isBossBattle ? this.startBossBattle() : this.startNextCombat(this.currentBiome);
    }

    private static startBossBattle() {
        const boss = MonsterService.selectBossFromBiome(AppData.monsters);
        this.currentMonster = boss;
        HUD.updateMonsterStats(this.currentMonster);
        this.setupAttackButtons();
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
