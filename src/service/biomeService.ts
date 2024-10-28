import { Biome } from '../types';

export class BiomeService {
    // Trouve un biome par son nom
    public static findBiomeByName(biomes: Biome[], biomeName: string): Biome | undefined {
        return biomes.find(biome => biome.name === biomeName);
    }

    public static getRandomBiomes(biomes: Biome[], count: number): Biome[] {
        const shuffled = [...biomes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}