import { Biome } from '../types';

export class BiomeService {
    // Charge les informations du fichier biomes.json
    public static async loadBiomes(): Promise<Biome[]> {
        const response = await fetch('/data/biomes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Biome[];
    }

    // Trouve un biome par son nom
    public static findBiomeByName(biomes: Biome[], biomeName: string): Biome | undefined {
        return biomes.find(biome => biome.name === biomeName);
    }
}