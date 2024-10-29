import { Biome } from '../types';
import { Menu } from '../ui/menu';

export class BiomeService {

    public static getRandomBiomes(biomes: Biome[], count: number): Biome[] {
        // Vérifie que Menu.bannedBiome est bien un tableau pour éviter toute erreur

        if (Menu.bannedBiome) {
            const bannedBiomes = Menu.bannedBiome.name;
            // Filtre les biomes pour exclure ceux qui sont bannis
            const availableBiomes = biomes.filter(biome => !bannedBiomes.includes(biome.name));
            // Mélange les biomes restants
            const shuffled = [...availableBiomes].sort(() => 0.5 - Math.random());
            // Sélectionne le nombre de biomes requis
            return shuffled.slice(0, count);
        } else {
            const shuffled = [...biomes].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }

    }
}