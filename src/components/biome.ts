import { Biome } from '../types';

// Charge les informations du fichier biomes.json
export async function loadBiomes(): Promise<Biome[]> {
    const response = await fetch('/src/data/biomes.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Biome[];
}

// Exporte la fonction pour trouver un biome par son nom
export function findBiomeByName(biomes: Biome[], biomeName: string): Biome | undefined {
    return biomes.find(biome => biome.name === biomeName);
}