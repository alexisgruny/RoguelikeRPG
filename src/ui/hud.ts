// Chargement des fonctions depuis les autres fichiers
import { Monster, Biome } from '../types'; 
import { player } from '../components/role'; 
import { CombatSystem } from '../systems/combatSystem';

export class HUD {

    // Méthode pour initialiser le combat : met à jour l'affichage et configure les actions de combat
    public static initializeCombat(monster: Monster, biome: Biome) {
        this.updateDisplay(monster, biome); // Mise à jour de l'interface (stats, biome)
        this.setupCombatActions(monster, biome); // Configuration des actions (attaque)
    }

    // Met à jour l'affichage complet : joueur, monstre, et biome
    private static updateDisplay(monster: Monster, biome: Biome) {
        this.updatePlayerStats(); // Affiche les stats du joueur
        this.updateMonsterStats(monster); // Affiche les stats du monstre
        this.updateBiomeInfo(biome); // Affiche les infos sur le biome
    }

    // Met à jour l'affichage des statistiques du joueur
    private static updatePlayerStats() {
        const playerHealthElem = document.getElementById('player-health') as HTMLDivElement;
        playerHealthElem.textContent = `Vie: ${player.health}`; // Affiche la vie du joueur

        const playerAttackElem = document.getElementById('player-attack') as HTMLDivElement;
        playerAttackElem.textContent = `Attaque: ${player.attack}`; // Affiche l'attaque du joueur

        const playerDefenseElem = document.getElementById('player-defense') as HTMLDivElement;
        playerDefenseElem.textContent = `Défense: ${player.defense}`; // Affiche la défense du joueur
    }

    // Met à jour l'affichage des statistiques du monstre
    private static updateMonsterStats(monster: Monster) {
        const monsterNameElem = document.getElementById('monster-name') as HTMLDivElement;
        monsterNameElem.textContent = `Nom: ${monster.name}`; // Affiche le nom du monstre

        const monsterHealthElem = document.getElementById('monster-health') as HTMLDivElement;
        monsterHealthElem.textContent = `Vie: ${monster.health}`; // Affiche la vie du monstre

        const monsterAttackElem = document.getElementById('monster-attack') as HTMLDivElement;
        monsterAttackElem.textContent = `Attaque: ${monster.attack}`; // Affiche l'attaque du monstre

        const monsterDefenseElem = document.getElementById('monster-defense') as HTMLDivElement;
        monsterDefenseElem.textContent = `Défense: ${monster.defense}`; // Affiche la défense du monstre
    }

    // Met à jour l'affichage des informations sur le biome
    private static updateBiomeInfo(biome: Biome) {
        const biomeNameElem = document.getElementById('biome-name') as HTMLDivElement;
        biomeNameElem.textContent = `Biome: ${biome.name}`; // Affiche le nom du biome
    }

    // Configuration des actions de combat : écoute l'événement d'attaque du joueur
    private static setupCombatActions(monster: Monster, biome: Biome) {
        const attackButton = document.getElementById('attack-button');
        if (attackButton) {
            attackButton.addEventListener('click', () => this.handlePlayerAttack(monster, biome)); // Action d'attaque
        }
    }

    // Gère l'attaque du joueur
    private static handlePlayerAttack(monster: Monster, biome: Biome) {
        const { damageToMonster, monsterDefeated } = CombatSystem.playerAttack(monster); // Le joueur attaque

        this.logAction(`Player attacks ${monster.name} for ${damageToMonster} damage!`); // Log l'attaque

        if (monsterDefeated) {
            this.logAction(`${monster.name} defeated!`); // Si le monstre est vaincu
            this.endCombat('victory'); // Terminer le combat sur une victoire
        } else {
            this.handleMonsterAttack(monster, biome); // Le monstre attaque en retour si pas vaincu
        }

        this.updateDisplay(monster, biome); // Mettre à jour l'affichage après l'attaque
    }

    // Gère l'attaque du monstre
    private static handleMonsterAttack(monster: Monster, biome: Biome) {
        const { damageToPlayer, playerDefeated } = CombatSystem.monsterAttack(monster); // Le monstre attaque

        this.logAction(`${monster.name} attacks for ${damageToPlayer} damage!`); // Log l'attaque

        if (playerDefeated) {
            this.logAction("Player is defeated..."); // Si le joueur est vaincu
            this.endCombat('defeat'); // Terminer le combat sur une défaite
        }

        this.updateDisplay(monster, biome); // Mettre à jour l'affichage après l'attaque
    }

    // Enregistre une action de combat dans le journal
    private static logAction(action: string) {
        const logOutputElem = document.getElementById('log-output') as HTMLDivElement;
        logOutputElem.textContent += `${action}\n`; // Ajoute l'action au log
        logOutputElem.scrollTop = logOutputElem.scrollHeight; // Scroll vers le bas du log
    }

    // Gère la fin du combat avec un résultat (victoire ou défaite)
    private static endCombat(result: 'victory' | 'defeat') {
        const resultModal = document.getElementById('result-modal') as HTMLDivElement;
        const resultTitle = document.getElementById('result-title') as HTMLHeadingElement;
        const resultMessage = document.getElementById('result-message') as HTMLParagraphElement;

        if (result === 'victory') {
            resultTitle.textContent = "Victory!"; // Affiche "Victoire"
            resultMessage.textContent = "You have defeated the monster!"; // Message de victoire
        } else {
            resultTitle.textContent = "Defeat..."; // Affiche "Défaite"
            resultMessage.textContent = "You have been defeated by the monster."; // Message de défaite
        }

        resultModal.classList.remove('hidden'); // Affiche la modal de résultat
        resultModal.style.display = 'flex';

        // Ajoute un écouteur pour fermer la modal et recharger la page
        document.getElementById('close-modal-button')?.addEventListener('click', () => {
            resultModal.style.display = 'none'; // Cache la modal
            resultModal.classList.add('hidden'); // Marque la modal comme cachée
            window.location.reload(); // Recharge la page pour réinitialiser le jeu
        });
    }
}









