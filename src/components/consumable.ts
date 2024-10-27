import { Consumable} from '../types';

export class ConsumableService {
    // Charge les informations du fichier Equipement.json



    public static async loadConsumable(): Promise<Consumable[]> {
        const response = await fetch('/data/consumable.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Consumable[];
    }
}