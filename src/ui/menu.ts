// Importation des modules nécessaires
import { Role, Biome } from '../types';
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
    private static biome1Button = document.getElementById('biome1-button') as HTMLButtonElement;
    private static biome2Button = document.getElementById('biome2-button') as HTMLButtonElement;
    private static skillButton = document.getElementById('skill-button') as HTMLButtonElement;
    private static equipementButton = document.getElementById('consumable-button') as HTMLButtonElement;
    private static consumableButton = document.getElementById('equipement-button') as HTMLButtonElement;
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
            roleContainer.classList.add(`role${role.name}`); // Ajoute une classe pour le styliser avec le CSS


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

            roleContainer.appendChild(button); // Ajoute le bouton au menu des rôles
            roleContainer.appendChild(imageElement); // Ajoute l'image sous le bouton
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

    // Configure deux boutons de sélection de biome de manière aléatoire
    private static setupBiomeButtons() {
        const [biome1, biome2] = BiomeService.getRandomBiomes(AppData.biomes, 2);

        // Configure les boutons pour chaque biome
        this.setupBiomeButton(this.biome1Button, biome1);
        this.setupBiomeButton(this.biome2Button, biome2);
    }

    // Configure un bouton pour lancer un combat dans le biome sélectionné
    private static setupBiomeButton(button: HTMLButtonElement, biome: Biome) {
        button.textContent = biome.name;
        button.onclick = () => {
            GameInitializer.startNextCombat(biome);
            this.bannedBiome = biome;
            this.toggleVisibility(this.biomeMenu, false); // Masquer le menu des biomes
            this.toggleVisibility(this.combatSection, true); // Afficher la section de combat
            changeBackgroundForBiome(biome.image);
        };
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
}

