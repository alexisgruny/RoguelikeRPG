// Chargement des fonctions/roles depuis les autres fichiers
import { Role, Monster, Biome } from '../types';
import { CombatSystem } from '../systems/combatSystem';
import { BiomeService } from '../components/biome';
import { RoleService } from '../components/role';

// Fonction principale exécutée une fois le DOM chargé
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Charger les biomes et vérifier qu'il y en a suffisamment
        const biomes = await BiomeService.loadBiomes();
        if (biomes.length < 2) throw new Error('Not enough biomes available to display options.'); 

        // Charger les roles et vérifier qu'il y en a suffisamment
        const roles = await RoleService.loadRoles();
        if (roles.length < 2) throw new Error('Not enough roles available to display options.');

        // Initialisation des éléments du DOM
        const startMenu = document.getElementById('start-menu')!;
        const startButton = document.getElementById('start-button') as HTMLButtonElement;
        const roleMenu = document.getElementById('role-menu')!;
        const biomeMenu = document.getElementById('biome-menu')!;
        const combatSection = document.getElementById('combat-section')!;
        const biome1Button = document.getElementById('biome1-button') as HTMLButtonElement;
        const biome2Button = document.getElementById('biome2-button') as HTMLButtonElement;

        // Cacher la section de combat au départ
        combatSection.classList.add('hidden');

        // Afficher le menu des roles une fois que le joueur clique sur "Jouer"
        startButton.addEventListener('click', () => {
            startMenu.classList.add('hidden'); // Masquer le menu de démarrage
            roleMenu.classList.remove('hidden'); // Afficher le menu des roles
        });

        // Construction dynamique des boutons de roles
        roles.forEach(role => {
            const button = document.createElement('button');
            button.textContent = role.name;
            button.id = role.name;
            
            // Lorsqu'une role est sélectionnée, cacher le menu des roles et afficher le menu des biomes
            button.addEventListener('click', () => {
                RoleService.pickRole(roles, role.name); // Enregistrer la role choisie
                roleMenu.classList.add('hidden'); // Masquer le menu des roles
                biomeMenu.classList.remove('hidden'); // Afficher le menu des biomes
            });

            roleMenu.appendChild(button); // Ajouter le bouton au menu des roles
        });

        // Sélection de deux biomes aléatoires et affichage des boutons correspondants
        const [biome1, biome2] = getRandomBiomes(biomes, 2);
        biome1Button.textContent = biome1.name;
        biome2Button.textContent = biome2.name;

        // Gestion du choix de biome et démarrage du combat
        biome1Button.addEventListener('click', async () => {
            startCombatForBiome(biomeMenu, combatSection, biome1.name);
        });

        biome2Button.addEventListener('click', async () => {
            startCombatForBiome(biomeMenu, combatSection, biome2.name);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des biomes ou de la configuration des boutons:', error);
    }
});

/**
 * Fonction pour démarrer le combat après la sélection d'un biome
 * @param biomeMenu - Élément DOM représentant le menu de biomes
 * @param combatSection - Élément DOM représentant la section de combat
 * @param biomeName - Nom du biome choisi
 */
async function startCombatForBiome(biomeMenu: HTMLElement, combatSection: HTMLElement, biomeName: string) {
    biomeMenu.classList.add('hidden'); // Masquer le menu des biomes
    combatSection.classList.remove('hidden'); // Afficher la section de combat
    await CombatSystem.startCombat(biomeName); // Démarrer le combat dans le biome sélectionné
}

/**
 * Fonction utilitaire pour sélectionner un nombre aléatoire de biomes
 * @param biomes - Liste de tous les biomes disponibles
 * @param count - Nombre de biomes à sélectionner
 * @returns Un tableau des biomes sélectionnés
 */
function getRandomBiomes(biomes: Biome[], count: number): Biome[] {
    const shuffled = [...biomes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}