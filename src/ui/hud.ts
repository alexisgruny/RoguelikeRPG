import { Monster, Biome, Role } from '../types';
import { player } from '../components/role';

export class HUD {
    public static updatePlayerStats() {
        const playerRole = document.getElementById('player-role')!;
        const playerHealthElem = document.getElementById('player-health') as HTMLDivElement;
        playerHealthElem.textContent = `Vie: ${player.health}`;
        const playerAttackElem = document.getElementById('player-attack') as HTMLDivElement;
        playerAttackElem.textContent = `Attaque: ${player.attack}`;
        const playerDefenseElem = document.getElementById('player-defense') as HTMLDivElement;
        playerDefenseElem.textContent = `Défense: ${player.defense}`;
    }

    public static updateMonsterStats(monster: Monster) {
        const MonsterNameElem = document.getElementById('monster-name')!;
        const monsterHealthElem = document.getElementById('monster-health') as HTMLDivElement;
        monsterHealthElem.textContent = `Vie: ${monster.health}`;
        const monsterAttackElem = document.getElementById('monster-attack') as HTMLDivElement;
        monsterAttackElem.textContent = `Attaque: ${monster.attack}`;
        const monsterDefenseElem = document.getElementById('monster-defense') as HTMLDivElement;
        monsterDefenseElem.textContent = `Défense: ${monster.defense}`;
    }

    public static logAction(action: string) {
        const logOutputElem = document.getElementById('log-output') as HTMLDivElement;
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }

    public static showResult(result: 'victory' | 'defeat' | 'final-victory') {
        const resultModal = document.getElementById('result-modal') as HTMLDivElement;
        const resultTitle = document.getElementById('result-title') as HTMLHeadingElement;
        const resultMessage = document.getElementById('result-message') as HTMLParagraphElement;

        if (result === 'victory') {
            resultTitle.textContent = "Victory!";
            resultMessage.textContent = "You have defeated the monster!";
        } else if (result === 'defeat') {
            resultTitle.textContent = "Defeat...";
            resultMessage.textContent = "You have been defeated.";
        } else if (result === 'final-victory') {
            resultTitle.textContent = "Final Victory!";
            resultMessage.textContent = "Congratulations! You've defeated all the monsters!";
            const closeModal = document.getElementById('close-modal-button')!;
            closeModal.addEventListener('click',() => {
                window.location.reload();
            })
        }

        resultModal.classList.remove('hidden');
        resultModal.style.display = 'flex';
    }
}







