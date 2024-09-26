import { Monster, Biome, Role, PlayerStats, Items } from '../types';
import { RoleService } from '../components/role';
import { PlayerStatsService } from '../systems/playerStatsManager'
import { CombatManager } from 'systems/combatManager';

export class HUD {
    // Fonction générique pour mettre à jour un élément HTML
    private static updateElementText(elementId: string, text: string) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = text;
    }

    // Mise à jour des stats du joueur à l'écran
    public static updatePlayerStats(playerStats: PlayerStats): void {
        this.updateElementText('player-role', playerStats.name);
        this.updateElementText('player-health', `Health: ${playerStats.health}/${playerStats.maxHealth}`);
        this.updateElementText('player-attack', `Attack: ${playerStats.attack}`);
        this.updateElementText('player-defense', `Defense: ${playerStats.defense}`);
        this.updateElementText('player-lvl', `Niveau: ${playerStats.level}`);
        this.updateElementText('player-xp', `expérience: ${playerStats.experience}/${playerStats.experienceToNextLevel}`);
    }

    // Mise à jour des stats du monstre à l'écran
    public static updateMonsterStats(monster: Monster) {
        this.updateElementText('monster-name', monster.name);
        this.updateElementText('monster-health', `Vie: ${monster.health}`);
        this.updateElementText('monster-attack', `Attaque: ${monster.attack}`);
        this.updateElementText('monster-defense', `Défense: ${monster.defense}`);
    }

    // affichage des log de combat
    public static logAction(action: string) {
        const logOutputElem = document.getElementById('log-output') as HTMLDivElement;
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }

    // reset les log de combat a chaque pression de l'attaque
    public static logRemove() {
        const logRemover = document.getElementById('log-output') as HTMLDivElement;
        logRemover.textContent = "";

    }

    // Fonction générique pour afficher une modale avec un contenu personnalisé
    public static showModal(modalId: string, titleText: string, messageText: string, callback?: Function) {
        const modal = document.getElementById(modalId) as HTMLDivElement;
        const title = modal.querySelector('#modal-title') as HTMLHeadingElement;
        const message = modal.querySelector('#modal-message') as HTMLParagraphElement;
        const closeButton = modal.querySelector('#close-modal-button') as HTMLButtonElement;

        title.textContent = titleText;
        message.textContent = messageText;

        // Ajouter un callback optionnel lors de la fermeture
        if (callback) {
            closeButton.addEventListener('click', () => {
                callback();
                this.hideAllModals();
            });
        } else {
            closeButton.addEventListener('click', this.hideAllModals);
        }

        modal.style.display = 'flex';  // Affiche la modal
    }

    // Fonction générique pour les événements
    public static showEventModal(eventType: string): void {
        const eventMessages: { [key: string]: { title: string; message: string } } = {
            victory: { title: 'Victoire!', message: 'Vous avez tué le monstre!' },
            defeat: { title: 'Défaite', message: 'Vous êtes mort.' },
            heal: { title: 'Repos', message: 'Vous faites un feu de camp.' },
            merchant: { title: 'Marchand', message: 'Vous rencontrez un marchand.' },
            boss: { title: 'Boss', message: 'Le boss vous attaque.' },
            end: { title: 'Fin', message: 'Vous avez fini le jeu' },
        };

        const { title, message } = eventMessages[eventType] || { title: 'Événement', message: 'Événement inconnu' };
        this.showModal('modal-victory-defeat', title, message);
    }

    // Fonction pour créer une modale pour la sélection de stats
    public static createStatModal(stats: { name: string, bonus: number }[], onSelect: Function): void {
        let modalContainer = document.getElementById('stat-modal-container') as HTMLDivElement;
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'stat-modal-container';
            modalContainer.classList.add('modal-container');
            document.body.appendChild(modalContainer);
        }

        modalContainer.innerHTML = '';  // Clear previous modals
        stats.forEach((stat, index) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>${stat.name}</h2>
                    <p>Augmentation: ${stat.bonus}</p>
                    <button id="select-button-${index}">Sélectionner</button>
                </div>`;

            const selectButton = modal.querySelector(`#select-button-${index}`);
            if (selectButton) {
                selectButton.addEventListener('click', () => {
                    onSelect(stat.name, stat.bonus);
                    HUD.hideAllModals();  // Masquer toutes les modales après la sélection
                });
            }
            modalContainer.style.display = 'flex';
            modalContainer.appendChild(modal);
        });
    }

    // Fonction pour créer une modale pour la sélection de d'objet
    public static createItemSelectionModal(items: Items[], onSelect: (itemId: string) => void): void {
        let modalContainer = document.getElementById('stat-modal-container') as HTMLDivElement;
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'stat-modal-container';
            modalContainer.classList.add('modal-container');
            document.body.appendChild(modalContainer);
        }
    
        modalContainer.innerHTML = '';
        items.forEach((item, index) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                    <p>Type: ${item.type}</p>
                    <p>Poid: ${item.weight}</p>
                    <button id="select-button-${index}">Sélectionner ${item.name}</button>
                </div>`;
    
            const selectButton = modal.querySelector(`#select-button-${index}`);
            if (selectButton) {
                selectButton.addEventListener('click', () => {
                    onSelect(item.id);  // Pass the item ID to the callback
                    HUD.hideAllModals();  // Masquer toutes les modales après la sélection
                });
            }
            modalContainer.style.display = 'flex';
            modalContainer.appendChild(modal);
        });
    }

     // Fonction pour cacher toutes les modales
     public static hideAllModals() {
        const modals = document.querySelectorAll('.modal') as NodeListOf<HTMLDivElement>;
        const modalContainer = document.getElementById('stat-modal-container');
        if (modalContainer) {
            modalContainer.style.display = 'none';
        }
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
}
