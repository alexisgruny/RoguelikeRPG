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
        const droppedItems: Items[] = await this.loadItems();
        const itemsToChooseFrom: Items[] = droppedItems.filter(item => {
            const dropChance = this.getDropChance(item.rarity, battleCount);
            return Math.random() < dropChance;
        });

        // Limiter à deux objets récupérables
        const selectedItems: Items[] = [];
        for (let i = 0; i < 2; i++) {
            if (itemsToChooseFrom.length === 0) break;
            const randomIndex = Math.floor(Math.random() * itemsToChooseFrom.length);
            selectedItems.push(itemsToChooseFrom[randomIndex]);
            itemsToChooseFrom.splice(randomIndex, 1);
        }

        // Appel de la modal
        HUD.createItemSelectionModal(selectedItems, (selectedItem: Items) => {
            const playerStats = PlayerStatsService.playerStats;
            const playerItems: Items[] = []
            playerItems.push(selectedItem)
            switch (selectedItem.type) {
                case 'compétence':
                    // Gestion des compétences
                    break;
                case 'consommable':
                    // Gestion des consommables
                    break;
                case 'équipement':
                    // Gestion des équipements
                    break;
            }
            HUD.updatePlayerStats(playerStats);
        });
    }
}
