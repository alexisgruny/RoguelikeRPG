import { Player, Monster, Biome } from '../types';
import { player } from '../components/player';

export function initializeCombat(monster: Monster, biome: Biome) {
    // Références aux éléments HTML
    const playerHealthElem = document.getElementById('player-health') as HTMLDivElement;
    const playerAttackElem = document.getElementById('player-attack') as HTMLDivElement;
    const playerDefenseElem = document.getElementById('player-defense') as HTMLDivElement;

    const monsterNameElem = document.getElementById('monster-name') as HTMLDivElement;
    const monsterHealthElem = document.getElementById('monster-health') as HTMLDivElement;
    const monsterAttackElem = document.getElementById('monster-attack') as HTMLDivElement;
    const monsterDefenseElem = document.getElementById('monster-defense') as HTMLDivElement;

    const biomeNameElem = document.getElementById('biome-name') as HTMLDivElement;
    const logOutputElem = document.getElementById('log-output') as HTMLDivElement;

    function updateDisplay() {
        playerHealthElem.textContent = `Player Health: ${player.health}`;
        playerAttackElem.textContent = `Player Attack: ${player.attack}`;
        playerDefenseElem.textContent = `Player Defense: ${player.defense}`;

        monsterNameElem.textContent = `Monster Name: ${monster.name}`;
        monsterHealthElem.textContent = `Monster Health: ${monster.health}`;
        monsterAttackElem.textContent = `Monster Attack: ${monster.attack}`;
        monsterDefenseElem.textContent = `Monster Defense: ${monster.defense}`;

        biomeNameElem.textContent = `Biome: ${biome.name}`;
    }

    function logAction(action: string) {
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }

    function playerAttack() {
        let damageToMonster = player.attack - monster.defense;
        damageToMonster = damageToMonster > 0 ? damageToMonster : 1;
        monster.health -= damageToMonster;

        logAction(`Player attacks ${monster.name} for ${damageToMonster} damage!`);
        if (monster.health <= 0) {
            logAction(`${monster.name} defeated!`);
            monster.health = 0;
        } else {
            monsterAttack(monster);
        }

        updateDisplay();
    }

    document.getElementById('attack-button')!.addEventListener('click', playerAttack);

    function monsterAttack(monster: Monster) {
        let damageToPlayer = monster.attack - player.defense;
        damageToPlayer = damageToPlayer > 0 ? damageToPlayer : 1;
        player.health -= damageToPlayer;

        logAction(`${monster.name} attacks for ${damageToPlayer} damage!`);
        if (player.health <= 0) {
            logAction("Player is defeated...");
            player.health = 0;
        }

        updateDisplay();
    }

    updateDisplay();
}