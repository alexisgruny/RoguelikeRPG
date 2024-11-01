import { Monster, Biome, Role, PlayerStats, Skill, Consumable, Equipement } from '../types';
import { RoleService } from '../service/roleService';
import { PlayerStatsService } from '../service/playerManagerService';
import { CombatSystem } from '../systems/combatSystem';
import { GameInitializer } from '../systems/gameSetup';
import { updateHealthBar } from '../components/healthBar';

export class HUD {
    // Fonction générique pour mettre à jour un élément HTML
    private static updateElementText(elementId: string, text: string) {
        const element = document.getElementById(elementId) as HTMLElement;
        if (element) {
            element.textContent = text;
        }
    }

    private static updateImage(elementId: string, image: string) {
        const imgElement = document.getElementById(elementId) as HTMLImageElement ;
        if (imgElement) {
            imgElement.src = image;
        }
    }

    // Mise à jour des stats du joueur à l'écran
    public static updatePlayerStats(playerStats: PlayerStats){
        this.updateElementText('player-role', playerStats.name);
        this.updateElementText('player-health', `Health: ${playerStats.health}/${playerStats.maxHealth}`);
        updateHealthBar('player-health-bar', playerStats.health, playerStats.maxHealth);
        this.updateElementText('player-attack', `${playerStats.attack}`);
        this.updateElementText('player-defense', `${playerStats.defense}`);
        this.updateElementText('player-lvl', `Niveau: ${playerStats.level}`);
        this.updateElementText('player-xp', `Expérience: ${playerStats.experience}/${playerStats.experienceToNextLevel}`);
        this.updateImage('player-image', `${playerStats.image}`)
    }

    // Mise à jour des stats du monstre à l'écran
    public static updateMonsterStats(monster: Monster | null) {
        if (monster === null) {
            this.updateElementText('monster-name', 'default');
            this.updateElementText('monster-health', `Vie: `);
            this.updateElementText('monster-attack', `Attaque: `);
            this.updateElementText('monster-defense', `Défense: `);
        } else {
            this.updateElementText('monster-name', monster.name);
            this.updateElementText('monster-health', `Vie: ${monster.health}/${monster.maxHealth}`);
            updateHealthBar('monster-health-bar', monster.health, monster.maxHealth);
            this.updateElementText('monster-attack', `${monster.attack}`);
            this.updateElementText('monster-defense', `${monster.defense}`);
            this.updateImage('monster-image', `${monster.image}`)
        }
    }

    // Affichage et gestion des logs de combat
    public static logAction(action: string) {
        const logOutputElem = document.getElementById('log-output') as HTMLDivElement;
        if (logOutputElem) {
            logOutputElem.textContent += action + "\n";
            logOutputElem.scrollTop = logOutputElem.scrollHeight;
        }
    }

    public static clearLogs() {
        const logRemover = document.getElementById('log-output') as HTMLDivElement;
        if (logRemover) logRemover.textContent = "";
    }

    // Fonction générique pour afficher une modale avec un contenu personnalisé
    public static showModal(modalId: string, titleText: string, messageText: string, callback?: Function) {
        const modal = document.getElementById(modalId) as HTMLDivElement;
        const title = modal?.querySelector('#modal-title') as HTMLHeadingElement;
        const message = modal?.querySelector('#modal-message') as HTMLParagraphElement;
        const closeButton = modal?.querySelector('#close-modal-button') as HTMLButtonElement;

        if (modal && title && message && closeButton) {
            title.textContent = titleText;
            message.textContent = messageText;

            closeButton.onclick = () => {
                callback && callback();
                this.hideModal(modalId);
            };

            modal.style.display = 'flex'; // Affiche la modale
        }
    }

    // Affichage d'une modale d'événement
    public static showEventModal(eventType: string): void {
        const eventMessages = {
            victory: { title: 'Victoire!', message: 'Vous avez tué le monstre!' },
            defeat: { title: 'Défaite', message: 'Vous êtes mort.' },
            item: { title: 'Objet', message: 'Vous avez trouvé un objet magique!' },
            heal: { title: 'Repos', message: 'Vous faites un feu de camp.' },
            merchant: { title: 'Marchand', message: 'Vous rencontrez un marchand.' },
            boss: { title: 'Boss', message: 'Le boss vous attaque.' },
            end: { title: 'Fin', message: 'Vous avez fini le jeu.' },
            biomeChange: { title: 'Changement de biome', message: 'Vous changez de biome' }
        };

        if (eventType in eventMessages) {
            const { title, message } = eventMessages[eventType as keyof typeof eventMessages];
            this.showModal('modal-victory-defeat', title, message);
        } else {
            this.showModal('modal-victory-defeat', 'Événement', 'Événement inconnu');
        }
    }

    // Fonction pour afficher une modale de sélection de stats
    public static createStatModal(stats: { name: string, bonus: number }[], onSelect: (name: string, bonus: number) => void): void {
        const modalContainer = this.createOrGetModalContainer('level-modal-container');

        modalContainer.innerHTML = '';
        stats.forEach((stat, index) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>${stat.name}</h2>
                    <p>Augmentation: ${stat.bonus}</p>
                    <button id="select-button-${index}">Sélectionner</button>
                </div>`;

            modal.querySelector(`#select-button-${index}`)?.addEventListener('click', () => {
                onSelect(stat.name, stat.bonus);
                this.hideModal('level-modal-container');
            });

            modalContainer.appendChild(modal);
        });

        modalContainer.style.display = 'flex';
    }

    // Fonction pour afficher une modale de sélection d'objet
    public static createEquipementSelectionModal(items: (Equipement | Skill | Consumable)[], onSelect: (selectedItem: any) => void) {
        const modalContainer = this.createOrGetModalContainer('item-modal-container');

        modalContainer.innerHTML = '';
        items.forEach((item, index) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>${item.name}</h2>
                    <h3>${item.type}</h3>
                    <p>${item.description}</p>
                    <p>${item.effectType} : ${item.amount}</p>
                    <p>Poid: ${item.weight}</p>
                    <button id="select-button-${index}">Sélectionner ${item.name}</button>
                </div>`;

            modal.querySelector(`#select-button-${index}`)?.addEventListener('click', () => {
                onSelect(item);
                this.hideModal('item-modal-container');
            });

            modalContainer.appendChild(modal);
        });

        modalContainer.style.display = 'flex';
    }

    // Fonction générique pour cacher une modale
    private static hideModal(modalId: string) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }

    // Handler pour afficher les menus de compétences, équipements ou consommables
    public static menuHandler(type: 'skill' | 'equipement' | 'consumable') {
        const buttonId = `${type}-button`;
        const menuId = 'info-menu';
        const listId = 'info-list';
        const TitleId = 'info-title';
        const backButtonId = 'back-to-main';
        const tooltip = this.createOrGetTooltip();

        document.getElementById(buttonId)?.addEventListener('click', () => {
            const mainMenu = document.getElementById('combat-actions');
            const sharedMenu = document.getElementById(menuId);
            const sharedList = document.getElementById(listId);
            const sharedTitle = document.getElementById(TitleId);

            if (mainMenu && sharedMenu && sharedList && sharedTitle) {
                switch (type) {
                    case 'skill':
                        sharedTitle.innerHTML = 'Compétences';
                        break;
                    case 'equipement':
                        sharedTitle.innerHTML = 'Équipements';
                        break;
                    case 'consumable':
                        sharedTitle.innerHTML = 'Consommables';
                        break;
                }
                mainMenu.style.display = 'none';
                sharedMenu.style.display = 'block';
                sharedList.innerHTML = '';

                const items = this.getItemsByType(type);
                items.forEach(item => {
                    const itemButton = document.createElement('button');
                    itemButton.textContent = item.name;
                    itemButton.classList.add(`${type}-button`);

                    itemButton.addEventListener('mouseover', (e) => this.showTooltip(tooltip, item, e));
                    itemButton.addEventListener('mouseout', () => (tooltip.style.display = 'none'));

                    if (type === 'skill') {
                        itemButton.addEventListener('click', () => {
                            const currentMonster = GameInitializer.currentMonster;
                            if (currentMonster) { // Vérifie que currentMonster n'est pas null
                                CombatSystem.applyPlayerSkill(item as Skill, currentMonster);
                                mainMenu.style.display = 'flex';
                                sharedMenu.style.display = 'none';
                            } else {
                                console.warn("Aucun monstre n'est actuellement sélectionné pour attaquer.");
                            }
                        });
                    }
                    sharedList.appendChild(itemButton);
                });
            }
        });

        document.getElementById(backButtonId)?.addEventListener('click', () => {
            const mainMenu = document.getElementById('combat-actions');
            const sharedMenu = document.getElementById(menuId);

            if (mainMenu && sharedMenu) {
                mainMenu.style.display = 'flex';
                sharedMenu.style.display = 'none';
            }
        });
    }

    // Helper pour créer ou récupérer un tooltip
    private static createOrGetTooltip() {
        let tooltip = document.querySelector('.tooltip') as HTMLDivElement;
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.style.display = 'none';
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }

    private static showTooltip(tooltip: HTMLDivElement, item: any, e: MouseEvent) {
        tooltip.textContent = item.explanation || `${item.effectType} : ${item.amount}`;
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.display = 'block';
    }

    // Fonction générique pour récupérer des items selon le type
    private static getItemsByType(type: 'skill' | 'equipement' | 'consumable') {
        switch (type) {
            case 'skill': return PlayerStatsService.playerSkills;
            case 'equipement': return PlayerStatsService.playerEquipement;
            case 'consumable': return PlayerStatsService.playerConsumable;
            default: return [];
        }
    }

    // Fonction pour créer ou récupérer un conteneur de modale
    private static createOrGetModalContainer(id: string): HTMLDivElement {
        let modalContainer = document.getElementById(id) as HTMLDivElement;
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = id;
            modalContainer.style.display = 'none';
            document.body.appendChild(modalContainer);
        }
        return modalContainer;
    }
}
