import { Items } from '../types';

export class itemService {
    // Charge les informations du fichier items.json
    public static async loadBiomes(): Promise<Items[]> {
        const response = await fetch('/data/items.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Items[];
    }
}