import { Monster, Biome, Role, PlayerStats, Items, Consumable, Equipement } from '../types';
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
                this.hideEventModal();
            });
        } else {
            closeButton.addEventListener('click', this.hideEventModal);
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
        let modalContainer = document.getElementById('level-modal-container') as HTMLDivElement;
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'level-modal-container';
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
                    HUD.hideLevelModal();  // Masquer toutes les modales après la sélection
                });
            }
            modalContainer.style.display = 'flex';
            modalContainer.appendChild(modal);
        });
    }

    // Fonction pour créer une modale pour la sélection de d'objet
    public static createItemSelectionModal(items: Items[], onSelect: (selectedItem: Items) => void) {
        let modalContainer = document.getElementById('item-modal-container') as HTMLDivElement;
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'item-modal-container';
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
                    onSelect(item);
                    HUD.hideItemModal();  // Masquer toutes les modales après la sélection
                });
            }
            modalContainer.style.display = 'flex';
            modalContainer.appendChild(modal);
        });
    }
    // Fonction pour cacher toutes les modales
    public static hideItemModal() {
        const itemModalContainer = document.getElementById('item-modal-container',);
        if (itemModalContainer) {
            itemModalContainer.style.display = 'none';
        }
    }
    public static hideLevelModal() {
        const levelModalContainer = document.getElementById('level-modal-container');
        if (levelModalContainer) {
            levelModalContainer.style.display = 'none';
        }
    }
    public static hideEventModal() {
        const eventModalContainer = document.getElementById('modal-victory-defeat');
        if (eventModalContainer) {
            eventModalContainer.style.display = 'none';
        }
    }

    public static menuHandler(type: 'skills' | 'equipements' | 'consumable') {
        const buttonId = type === 'skills' ? 'skill-button'
            : type === 'equipements' ? 'equipement-button'
                : 'consumable-button';

        const menuId = 'info-menu'; // Même div pour tous les types
        const listId = 'info-list'; // Même liste pour tous les types
        const backButtonId = 'back-to-main';

        // Création de l'info-bulle (tooltip) sans les styles
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');  // On applique simplement la classe CSS
        tooltip.style.display = 'none'; // Par défaut, caché
        document.body.appendChild(tooltip);

        document.getElementById(buttonId)?.addEventListener('click', () => {
            const mainMenu = document.getElementById('combat-actions');
            const sharedMenu = document.getElementById(menuId);
            const sharedList = document.getElementById(listId);

            if (mainMenu && sharedMenu && sharedList) {
                mainMenu.style.display = 'none';
                sharedMenu.style.display = 'block';
                sharedList.innerHTML = '';

                switch (type) {
                    case ('skills'):
                        PlayerStatsService.playerSkills.forEach((skill) => {
                            const skillButton = document.createElement('button');
                            skillButton.textContent = skill.name;
                            skillButton.classList.add('skill-button');

                            // Affiche l'info-bulle lors du survol
                            skillButton.addEventListener('mouseover', (e) => {
                                let effectsText = skill.effects.map(effect =>
                                    `Tier: ${effect.tier}, ${effect.explanation}`
                                ).join('\n');

                                tooltip.textContent = effectsText;
                                tooltip.style.left = `${e.pageX + 10}px`;
                                tooltip.style.top = `${e.pageY + 10}px`;
                                tooltip.style.display = 'block';
                            });

                            // Cache l'info-bulle lorsque la souris quitte
                            skillButton.addEventListener('mouseout', () => {
                                tooltip.style.display = 'none';
                            });

                            sharedList.appendChild(skillButton);
                        });
                        break;

                    case ('equipements'):
                        PlayerStatsService.playerEquipement.forEach((equipement) => {
                            const equipementInfo = document.createElement('p');
                            equipementInfo.textContent = equipement.name;
                            equipementInfo.classList.add('equipement-text');

                            // Affiche l'info-bulle lors du survol
                            equipementInfo.addEventListener('mouseover', (e) => {
                                let effectsText = equipement.effects.map(effect =>
                                    `Tier: ${effect.tier}, ${effect.explanation}`
                                ).join('\n');

                                tooltip.textContent = effectsText;
                                tooltip.style.left = `${e.pageX + 10}px`;
                                tooltip.style.top = `${e.pageY + 10}px`;
                                tooltip.style.display = 'block';
                            });

                            equipementInfo.addEventListener('mouseout', () => {
                                tooltip.style.display = 'none';
                            });

                            sharedList.appendChild(equipementInfo);
                        });
                        break;

                    case ('consumable'):
                        PlayerStatsService.playerConsumable.forEach((consumable) => {
                            const consumableInfo = document.createElement('button');
                            consumableInfo.textContent = consumable.name;
                            consumableInfo.classList.add('consumable-button');

                            consumableInfo.addEventListener('mouseover', (e) => {
                                let effectsText = consumable.effects.map(effect =>
                                    `Tier: ${effect.tier}, ${effect.explanation}`
                                ).join('\n');

                                tooltip.textContent = effectsText;
                                tooltip.style.left = `${e.pageX + 10}px`;
                                tooltip.style.top = `${e.pageY + 10}px`;
                                tooltip.style.display = 'block';
                            });

                            consumableInfo.addEventListener('mouseout', () => {
                                tooltip.style.display = 'none';
                            });

                            sharedList.appendChild(consumableInfo);
                        });
                        break;
                }
            }
        });

        // Retour au menu principal
        document.getElementById(backButtonId)?.addEventListener('click', () => {
            const mainMenu = document.getElementById('combat-actions');
            const sharedMenu = document.getElementById(menuId);

            if (mainMenu && sharedMenu) {
                mainMenu.style.display = 'block';
                sharedMenu.style.display = 'none';
            }
        });
    }
}
