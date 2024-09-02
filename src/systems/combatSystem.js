import { loadBiomes, findBiomeByName } from '../components/biome.js';
import { loadMonsters, getMonstersFromBiome, selectRandomMonsters } from '../components/monsters.js';
import { player } from '../components/player.js';

export async function startCombat(currentBiomeName) {
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

export function initializeCombat(monster) {
    // Références aux éléments HTML
    // valeur d'affichage du personnage
    const playerHealthElem = document.getElementById('player-health');
    const playerAttackElem = document.getElementById('player-attack');
    const playerDefenseElem = document.getElementById('player-defense');
    // valeur d'affichage du monstre
    const monsterNameElem = document.getElementById('monster-name');
    const monsterHealthElem = document.getElementById('monster-health');
    const monsterattackElem = document.getElementById('monster-attack');
    const monsterdefenseElem = document.getElementById('monster-defense');
    // valeur d'affichage du biome
    const biomeNameElem = document.getElementById('biome-name');
    // Combat Log
    const logOutputElem = document.getElementById('log-output');

    // Mise à jour des affichages
    function updateDisplay() {
        // Affichage en temps réel des stats
        // player stats
        playerHealthElem.textContent = player.health;
        playerAttackElem.textContent = player.attack;
        playerDefenseElem.textContent = player.defense;
        //monstre stats
        monsterNameElem.textContent = monster.name;
        monsterHealthElem.textContent = monster.health;
        monsterattackElem.textContent = monster.attack;
        monsterdefenseElem.textContent = monster.defense;
        // biome name
        biomeNameElem.textContent = biome.name;
    }

    // Log des actions dans la zone de combat
    function logAction(action) {
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }

    // Action d'attaque du joueur
    document.getElementById('attack-button').addEventListener('click', () => {
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