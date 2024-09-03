import { loadBiomes, findBiomeByName } from '../components/biome';
import { loadMonsters, getMonstersFromBiome, selectRandomMonsters } from '../components/monsters';
import { player } from '../components/player';
import { Monster, Biome } from '../types';

export async function startCombat(currentBiomeName: string): Promise<Monster> {
    try {
        // Charger les biomes et les monstres
        const biomes = await loadBiomes();
        const monsters = await loadMonsters();

        // Obtenir les monstres pour le biome actuel
        const availableMonsters = getMonstersFromBiome(biomes, currentBiomeName, monsters);
        if (availableMonsters.length === 0) {
            throw new Error(`No monsters found for biome '${currentBiomeName}'`);
        }

        // Sélectionner un monstre aléatoire pour le combat
        const selectedMonster = selectRandomMonsters(availableMonsters, 1)[0];

        // Retourner le monstre sélectionné pour le combat
        return selectedMonster;

    } catch (error) {
        console.error('Erreur lors du démarrage du combat:', error);
        throw error; // Propager l'erreur pour la gérer dans main.js
    }
}

export function initializeCombat(monster: Monster) {
    // Références aux éléments HTML
    const playerHealthElem = document.getElementById('player-health') as HTMLElement;
    const playerAttackElem = document.getElementById('player-attack') as HTMLElement;
    const playerDefenseElem = document.getElementById('player-defense') as HTMLElement;

    const monsterNameElem = document.getElementById('monster-name') as HTMLElement;
    const monsterHealthElem = document.getElementById('monster-health') as HTMLElement;
    const monsterattackElem = document.getElementById('monster-attack') as HTMLElement;
    const monsterdefenseElem = document.getElementById('monster-defense') as HTMLElement;

    const biomeNameElem = document.getElementById('biome-name') as HTMLElement;
    const logOutputElem = document.getElementById('log-output') as HTMLElement;

    // Mise à jour des affichages
    function updateDisplay() {
        // Affichage en temps réel des stats
        playerHealthElem.textContent = player.health.toString();
        playerAttackElem.textContent = player.attack.toString();
        playerDefenseElem.textContent = player.defense.toString();

        monsterNameElem.textContent = monster.name;
        monsterHealthElem.textContent = monster.health.toString();
        monsterattackElem.textContent = monster.attack.toString();
        monsterdefenseElem.textContent = monster.defense.toString();

        // Si le biome est disponible (vous devrez ajuster ceci en fonction de votre code)
        biomeNameElem.textContent = "Forêt"; // Remplacer par le nom réel du biome si nécessaire
    }

    // Log des actions dans la zone de combat
    function logAction(action: string) {
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }

    // Action d'attaque du joueur
    document.getElementById('attack-button')?.addEventListener('click', () => {
        let damageToMonster = player.attack - monster.defense;
        damageToMonster = damageToMonster > 0 ? damageToMonster : 1;
        monster.health -= damageToMonster;

        logAction(`Player attacks ${monster.name} for ${damageToMonster} damage!`);
        if (monster.health <= 0) {
            logAction(`${monster.name} defeated!`);
            monster.health = 0;
        } else {
            monsterAttack();
        }

        updateDisplay();
    });

    // Attaque du monstre après l'attaque du joueur
    function monsterAttack() {
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

    // Initialisation de l'affichage
    updateDisplay();
}