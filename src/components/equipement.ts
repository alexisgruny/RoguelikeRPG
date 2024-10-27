import { Equipement } from '../types';

export class EquipementService {
    // Charge les informations du fichier Equipement.json



    public static async loadEquipement(): Promise<Equipement[]> {
        const response = await fetch('/data/equipement.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Equipement[];
    }
}
