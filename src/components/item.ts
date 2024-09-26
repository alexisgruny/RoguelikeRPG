import { HUD } from '../ui/HUD';
import { Items, PlayerStats } from '../types';
import { PlayerStatsService } from '../systems/playerStatsManager';

export class itemService {
    // Charge les informations du fichier items.json

    public static async loadItems(): Promise<Items[]> {
        const response = await fetch('/data/items.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Items[];
    }

    public static getDropChance(rarity: string, battleCount: number): number {
        const rarityMultiplier: Record<string, number> = {
            common: 0.5,
            uncommon: 0.3,
            rare: 0.15,
            legendary: 0.05
        };

        return rarityMultiplier[rarity] + (battleCount * 0.05);
    }

    public static async chooseItems(battleCount: number) {
        const droppedItems = await this.loadItems();
        const itemsToChooseFrom = droppedItems.filter(item => {
            const dropChance = this.getDropChance(item.rarity, battleCount);
            return Math.random() < dropChance; // Retourne vrai si l'objet est récupérable
        });

        // Choisissez deux objets parmi les items récupérables
        for (let i = 0; i < 2; i++) {
            if (itemsToChooseFrom.length === 0) break; // S'il n'y a plus d'objets, sortez

            const randomIndex = Math.floor(Math.random() * itemsToChooseFrom.length);
            droppedItems.push(itemsToChooseFrom[randomIndex]);
            itemsToChooseFrom.splice(randomIndex, 1); // Enlever l'objet choisi pour éviter les doublons
        }

        HUD.createItemSelectionModal(itemsToChooseFrom, (selectedItems) => {
            const playerStats = PlayerStatsService.playerStats
            switch (selectedItems) {
                case 'compétence':
                    break;
                case 'consommable':
                    break;
                case 'équipement':
                    break;
            }
            HUD.updatePlayerStats(playerStats);
        });
        itemsToChooseFrom.length = 0;
    }
}
