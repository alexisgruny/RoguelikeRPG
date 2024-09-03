import { Player, Monster, Biome } from '../types';
import { startCombat } from '../systems/combatSystem';
import { loadBiomes } from '../components/biome';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Charger les biomes à partir du JSON
        const biomes = await loadBiomes();

        // Assurez-vous qu'il y a au moins deux biomes pour les boutons
        if (biomes.length < 2) {
            throw new Error('Not enough biomes available to display options.');
        }

        // Sélectionner deux biomes aléatoires
        const [biome1, biome2] = getRandomBiomes(biomes, 2);

        // Configurer les boutons avec les noms des biomes
        const biome1Button = document.getElementById('biome1-button') as HTMLButtonElement;
        const biome2Button = document.getElementById('biome2-button') as HTMLButtonElement;

        if (!biome1Button || !biome2Button) {
            throw new Error('Biome buttons not found');
        }

        biome1Button.textContent = biome1.name;
        biome2Button.textContent = biome2.name;

        // Ajouter des événements pour commencer le combat avec le biome sélectionné
        biome1Button.addEventListener('click', () => {
            startCombat(biome1.name);
        });

        biome2Button.addEventListener('click', () => {
            startCombat(biome2.name);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des biomes ou de la configuration des boutons:', error);
    }
});

// Fonction pour sélectionner des biomes aléatoires
function getRandomBiomes(biomes: Biome[], count: number): Biome[] {
    const shuffled = [...biomes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}