import { Player, Monster, Biome } from '../types';
import { CombatSystem } from '../systems/combatSystem';
import { BiomeService } from '../components/biome';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const biomes = await BiomeService.loadBiomes();
        if (biomes.length < 2) {
            throw new Error('Not enough biomes available to display options.');
        }

        const biome1Button = document.getElementById('biome1-button') as HTMLButtonElement;
        const biome2Button = document.getElementById('biome2-button') as HTMLButtonElement;
        const biomeMenu = document.getElementById('biome-menu')!;
        const combatSection = document.getElementById('combat-section')!;

        combatSection.classList.add('hidden'); // Cacher la section de combat au début

        const [biome1, biome2] = getRandomBiomes(biomes, 2);
        biome1Button.textContent = biome1.name;
        biome2Button.textContent = biome2.name;

        biome1Button.addEventListener('click', async() => {
            biomeMenu.classList.add('hidden'); // Cacher le menu des biomes
            combatSection.classList.remove('hidden'); // Afficher la section de combat
            await CombatSystem.startCombat(biome1.name); // Démarrer le combat pour le premier biome
        });
        biome2Button.addEventListener('click', async () => {
            biomeMenu.classList.add('hidden'); 
            combatSection.classList.remove('hidden'); 
            await CombatSystem.startCombat(biome2.name); // Démarrer le combat pour le deuxième biome
        });
    } catch (error) {
        console.error('Erreur lors du chargement des biomes ou de la configuration des boutons:', error);
    }
});

function getRandomBiomes(biomes: Biome[], count: number): Biome[] {
    const shuffled = [...biomes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}