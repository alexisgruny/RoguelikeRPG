// Chargement des fonctions/roles depuis les autres fichiers
import { Role, Monster, Biome } from '../types';
import { BiomeService } from '../service/biomeService';
import { RoleService } from '../service/roleService';
import { HUD } from './HUD';
import { AppData } from '../data/appData';
import { GameInitializer } from '../systems/gameSetup';


export class Menu {

    private static startButton = document.getElementById('start-button') as HTMLButtonElement;
    private static startMenu = document.getElementById('start-menu')!;
    private static roleMenu = document.getElementById('role-menu')!;
    private static biomeMenu = document.getElementById('biome-menu')!;
    private static combatSection = document.getElementById('combat-section')!;
    private static biome1Button = document.getElementById('biome1-button') as HTMLButtonElement;
    private static biome2Button = document.getElementById('biome2-button') as HTMLButtonElement;
    public static bannedBiome: Biome;

    public static playButton() {
        this.startButton.addEventListener('click', () => {
            this.startMenu.classList.add('hidden'); // Masquer le menu de démarrage
            this.roleMenu.classList.remove('hidden'); // Afficher le menu des roles
            this.MenuRoleSelection();
        });

    }

    public static MenuRoleSelection() {

        // Construction dynamique des boutons de roles
        AppData.roles.forEach(role => {
            const button = document.createElement('button');
            button.textContent = role.name;
            button.id = role.name;

            // Lorsqu'une role est sélectionnée, cacher le menu des roles et afficher le menu des biomes
            button.addEventListener('click', () => {
                RoleService.pickRole(AppData.roles, role.name); // Enregistrer la role choisie
                this.roleMenu.classList.add('hidden'); // Masquer le menu des roles
                this.biomeMenu.classList.remove('hidden'); // Afficher le menu des biomes
                this.biomeSelectionMenu(); // Lance la sélection du biome
            });

            this.roleMenu.appendChild(button); // Ajouter le bouton au menu des roles
        });
    }

    public static biomeSelectionMenu() {
        // Sélection de deux biomes aléatoires et affichage des boutons correspondants
        const [biome1, biome2] = BiomeService.getRandomBiomes(AppData.biomes, 2);
        this.biome1Button.textContent = biome1.name;
        this.biome2Button.textContent = biome2.name;

        // Gestion du choix de biome et démarrage du combat
        this.biome1Button.addEventListener('click', async () => {
            GameInitializer.startNextCombat(biome1);
            this.bannedBiome = biome1;
            this.combatSection.classList.remove('hidden');
            this.biomeMenu.classList.add('hidden'); // Masquer le menu des biomes 
        });

        this.biome2Button.addEventListener('click', async () => {
            GameInitializer.startNextCombat(biome2);
            this.bannedBiome = biome2
            this.combatSection.classList.remove('hidden'); 
            this.biomeMenu.classList.add('hidden'); // Masquer le menu des biomes
        });

    }

    public static subMenuSetup() {
       // appel de la fonction d'affichage du menu de compétence
        HUD.menuHandler('skills');
        HUD.menuHandler('equipements');
        HUD.menuHandler('consumable')
    }
}
