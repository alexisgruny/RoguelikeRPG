// Importation des modules nécessaires
import { Biome, Equipement, Consumable, Skill } from '../types';
import { BiomeService } from '../service/biomeService';
import { RoleService } from '../service/roleService';
import { HUD } from './HUD';
import { AppData } from '../data/appData';
import { GameInitializer } from '../systems/gameSetup';
import { changeBackgroundForBiome } from '../components/backgroundChangement';

export class Menu {
    // Initialisation des éléments HTML
    private static startButton = document.getElementById('start-button') as HTMLButtonElement;
    private static startMenu = document.getElementById('start-menu')!;
    private static roleMenu = document.getElementById('role-menu')!;
    private static biomeMenu = document.getElementById('biome-menu')!;
    private static combatSection = document.getElementById('combat-section')!;
    private static log = document.getElementById('combat-log')!;
    private static combatAction = document.getElementById('combat-actions')!;
    private static eventScreen = document.getElementById('event-screen')!;
    public static bannedBiome: Biome;

    // Fonction pour démarrer le jeu en affichant le menu de sélection des rôles
    public static initialize() {
        this.startButton.addEventListener('click', () => {
            this.showRoleMenu();
        });
    }

    // Affiche le menu des rôles et initialise les boutons de sélection des rôles
    private static showRoleMenu() {
        this.toggleVisibility(this.startMenu, false); // Masquer le menu de démarrage
        this.toggleVisibility(this.roleMenu, true); // Afficher le menu des rôles
        this.setupRoleButtons();
    }

    // Configure les boutons pour chaque rôle dans `AppData.roles`
    private static setupRoleButtons() {
        this.roleMenu.innerHTML = ''; // Vide le contenu précédent pour éviter les doublons de boutons
        AppData.roles.forEach(role => {

            // Crée un conteneur pour le bouton et l'image du rôle
            const roleContainer = document.createElement('div') as HTMLDivElement;

            const button = document.createElement('button');
            button.textContent = role.name;
            button.id = role.name;
            // Ajoute un gestionnaire d'événement pour chaque bouton de rôle
            button.addEventListener('click', () => {
                RoleService.pickRole(AppData.roles, role.name); // Enregistre le rôle sélectionné
                this.showBiomeMenu(); // Affiche le menu de sélection de biome
            });

            // Création de l'élément image pour chaque rôle
            const imageElement = document.createElement('img');
            imageElement.id = role.name;
            imageElement.src = role.image;
            imageElement.alt = `${role.name} Image`;

            roleContainer.appendChild(imageElement); // Ajoute l'image sous le bouton
            roleContainer.appendChild(button); // Ajoute le bouton au menu des rôles
            this.roleMenu.appendChild(roleContainer); // Ajoute le conteneur du rôle au menu
        });
    }

    // Affiche le menu de sélection des biomes et configure les boutons pour les biomes
    public static showBiomeMenu() {
        this.toggleVisibility(this.roleMenu, false);
        this.toggleVisibility(this.combatSection, false);
        this.toggleVisibility(this.biomeMenu, true);
        this.setupBiomeButtons();
    }

    // Configure un bouton pour lancer un combat dans le biome sélectionné
    private static setupBiomeButtons() {

        const biomes = AppData.biomes;
        const randomBiome = BiomeService.getRandomBiomes(biomes, 3);

        this.biomeMenu.innerHTML = ''; // Vide le contenu précédent pour éviter les doublons de boutons

        randomBiome.forEach(biome => {

            // Crée un conteneur pour le bouton et l'image du rôle
            const biomeContainer = document.createElement('div') as HTMLDivElement;

            const button = document.createElement('button');
            button.textContent = biome.name;
            button.id = biome.name;

            // Ajoute un gestionnaire d'événement pour chaque bouton de rôle
            button.addEventListener('click', () => {
                GameInitializer.startNextCombat(biome);
                this.bannedBiome = biome;
                this.toggleVisibility(this.biomeMenu, false); // Masquer le menu des biomes
                this.toggleVisibility(this.combatSection, true); // Afficher la section de combat
                this.toggleVisibility(this.log, true); // Afficher la section de combat
                this.toggleVisibility(this.combatAction, true); // Afficher la section de combat
                changeBackgroundForBiome(biome.image);
                this.setupSubMenu(); // Affiche le menu de sélection de biome
            });

            // Création de l'élément image pour chaque rôle
            const imageElement = document.createElement('img');
            imageElement.id = biome.name;
            imageElement.src = biome.image;
            imageElement.alt = `${biome.name} Image`;

            biomeContainer.appendChild(imageElement); // Ajoute l'image sous le bouton
            biomeContainer.appendChild(button); // Ajoute le bouton au menu des rôles
            this.biomeMenu.appendChild(biomeContainer); // Ajoute le conteneur du rôle au menu
        });
    }

    public static ItemSelectionMenu(items: (Equipement | Skill | Consumable)[], onSelect: (selectedItem: any) => void) {
        // Activer l'affichage du menu de sélection d'items
        this.toggleVisibility(this.eventScreen, true);
        this.toggleVisibility(this.combatSection, false);
        this.toggleVisibility(this.log, false);
        this.toggleVisibility(this.combatAction, false);
        // Sélectionne le conteneur principal
        const container = document.getElementById("event-screen");
        if (!container) return;

        // Efface le contenu précédent du conteneur pour éviter des duplications
        container.innerHTML = '';
        const victory = document.createElement("h1");
        victory.textContent = "Victory !";
        container.appendChild(victory);

        // Boucle pour chaque item du tableau
        items.forEach(item => {

            // Création des éléments de la div item
            const itemDiv = document.createElement("div");
            itemDiv.classList.add('item-selection', `item-div-${item.id}`);
            
            // Création et configuration des éléments enfant
            const title = document.createElement("h3");
            title.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const stats = document.createElement("p");
            stats.textContent = `${item.amount}`; // Affichage de l'attribut `amount`

            const selectButton = document.createElement("button");
            selectButton.textContent = `Sélectionner ${item.name}`;

            // Gestionnaire de clic pour le bouton de sélection
            selectButton.addEventListener("click", () => onSelect(item));

            // Ajout des éléments enfant à la div item
            itemDiv.append(title, description, stats, selectButton);

            // Ajoute la div de l'item au conteneur principal
            container.appendChild(itemDiv);            
        });
    }

    // Configure le sous-menu pour les compétences, équipements et consommables
    public static setupSubMenu() {
        this.initializeMenu('skill');
        this.initializeMenu('equipement');
        this.initializeMenu('consumable');
    }

    private static initializeMenu(type: 'skill' | 'equipement' | 'consumable') {
        // Vérifie si l'écouteur d'événements existe déjà pour éviter les doublons
        if (!document.getElementById(`${type}-button`)?.hasAttribute('data-initialized')) {
            HUD.menuHandler(type);
            document.getElementById(`${type}-button`)?.setAttribute('data-initialized', 'true'); // Marque le bouton comme initialisé
        }
    }

    // Fonction utilitaire pour afficher ou masquer un élément
    private static toggleVisibility(element: HTMLElement, visible: boolean) {
        element.classList.toggle('hidden', !visible);
    }
    public static showCombatHUD() {
        this.toggleVisibility(this.eventScreen, false);
        this.toggleVisibility(this.combatSection, true);
        this.toggleVisibility(this.log, true);
        this.toggleVisibility(this.combatAction, true);
    }
}

