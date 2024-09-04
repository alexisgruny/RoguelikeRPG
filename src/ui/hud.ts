import { Monster, Biome } from '../types';
import { player } from '../components/player';
import { CombatSystem } from '../systems/combatSystem';

export class HUD {
    public static initializeCombat(monster: Monster, biome: Biome) {
        this.updateDisplay(monster, biome);
        this.setupCombatActions(monster, biome);
    }

    private static updateDisplay(monster: Monster, biome: Biome) {
        this.updatePlayerStats();
        this.updateMonsterStats(monster);
        this.updateBiomeInfo(biome);
    }

    private static updatePlayerStats() {
        const playerHealthElem = document.getElementById('player-health') as HTMLDivElement;
        playerHealthElem.textContent = `Vie: ${player.health}`;
        const playerAttackElem = document.getElementById('player-attack') as HTMLDivElement;
        playerAttackElem.textContent = `Attaque: ${player.attack}`;
        const playerDefenseElem = document.getElementById('player-defense') as HTMLDivElement;
        playerDefenseElem.textContent = `Défense: ${player.defense}`;
    }

    private static updateMonsterStats(monster: Monster) {
        const monsterNameElem = document.getElementById('monster-name') as HTMLDivElement;
        monsterNameElem.textContent = `Nom: ${monster.name}`;
        const monsterHealthElem = document.getElementById('monster-health') as HTMLDivElement;
        monsterHealthElem.textContent = `Vie: ${monster.health}`;
        const monsterAttackElem = document.getElementById('monster-attack') as HTMLDivElement;
        monsterAttackElem.textContent = `Attaque: ${monster.attack}`;
        const monsterDefenseElem = document.getElementById('monster-defense') as HTMLDivElement;
        monsterDefenseElem.textContent = `Défense: ${monster.defense}`;
    }

    private static updateBiomeInfo(biome: Biome) {
        const biomeNameElem = document.getElementById('biome-name') as HTMLDivElement;
        biomeNameElem.textContent = `Biome: ${biome.name}`;
    }

    private static setupCombatActions(monster: Monster, biome: Biome) {
        document.getElementById('attack-button')?.addEventListener('click', () => this.handlePlayerAttack(monster, biome));
    }

    private static handlePlayerAttack(monster: Monster, biome: Biome) {
        const { damageToMonster, monsterDefeated } = CombatSystem.playerAttack(monster);
        this.logAction(`Player attacks ${monster.name} for ${damageToMonster} damage!`);

        if (monsterDefeated) {
            this.logAction(`${monster.name} defeated!`);
            this.endCombat('victory');
        } else {
            this.handleMonsterAttack(monster, biome);
        }

        this.updateDisplay(monster, biome);
    }

    private static handleMonsterAttack(monster: Monster, biome: Biome) {
        const { damageToPlayer, playerDefeated } = CombatSystem.monsterAttack(monster);
        this.logAction(`${monster.name} attacks for ${damageToPlayer} damage!`);

        if (playerDefeated) {
            this.logAction("Player is defeated...");
            this.endCombat('defeat');
        }

        this.updateDisplay(monster, biome);
    }

    private static logAction(action: string) {
        const logOutputElem = document.getElementById('log-output') as HTMLDivElement;
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }

    private static endCombat(result: 'victory' | 'defeat') {
        const resultModal = document.getElementById('result-modal') as HTMLDivElement;
        const resultTitle = document.getElementById('result-title') as HTMLHeadingElement;
        const resultMessage = document.getElementById('result-message') as HTMLParagraphElement;

        if (result === 'victory') {
            resultTitle.textContent = "Victory!";
            resultMessage.textContent = "You have defeated the monster!";
        } else {
            resultTitle.textContent = "Defeat...";
            resultMessage.textContent = "You have been defeated by the monster.";
        }

        resultModal.classList.remove('hidden');
        resultModal.style.display = 'flex';

        document.getElementById('close-modal-button')?.addEventListener('click', () => {
            resultModal.style.display = 'none';
            resultModal.classList.add('hidden');
            window.location.reload();
        });
    }
}









