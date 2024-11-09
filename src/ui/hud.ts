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
        const imgElement = document.getElementById(elementId) as HTMLImageElement;
        if (imgElement) {
            imgElement.src = image;
        }
    }

    // Mise à jour des stats du joueur à l'écran
    public static updatePlayerStats(playerStats: PlayerStats) {
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

    public static showDamage(playerMonster: string, damage: number) {
        let targetElement: HTMLElement | null = null;
        let damageText: HTMLElement | null = null;
        if (playerMonster === 'player') {
            targetElement = document.querySelector('#player-visual');
            damageText = document.getElementById('damage-player-text');
        } else if (playerMonster === 'monster') {
            targetElement = document.querySelector('#monster-visual');
            damageText = document.getElementById('damage-monster-text');
        }

        if (targetElement && damageText) {
            // Réinitialise l'animation en supprimant puis en ajoutant la classe
            damageText.classList.remove('damage-animation');
            void damageText.offsetWidth; // Force le reflow pour réinitialiser l'animation
            damageText.classList.add('damage-animation');

            // Affiche le texte des dégâts et le rend visible
            damageText.style.opacity = '1';
            damageText.textContent = `-${damage}`;

            // Cache le texte après l'animation (optionnel)
            setTimeout(() => {
                damageText!.style.opacity = '0';
                damageText!.innerHTML = '';
            }, 2000); 
        }
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

    public static changeLevelDisplay() {
        const count = GameInitializer.combatCount;
        const biome = GameInitializer.currentBiome.name;
        const title = document.getElementById('biome-level-display');
        if (title) {
            title.innerHTML = `${biome} ${count}`;
        }
    }
}
