import { HUD } from '../ui/HUD';
import { Equipement, PlayerStats } from '../types';
import { PlayerStatsService } from '../systems/playerStatsManager';

export class EquipementService {
    // Charge les informations du fichier Equipement.json



    public static async loadEquipement(): Promise<Equipement[]> {
        const response = await fetch('/data/equipement.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Equipement[];
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

    public static async chooseEquipement(battleCount: number) {
        const droppedEquipement: Equipement[] = await this.loadEquipement();
        const EquipementToChooseFrom: Equipement[] = droppedEquipement.filter(item => {
            const dropChance = this.getDropChance(item.rarity, battleCount);
            return Math.random() < dropChance;
        });

        // Limiter à deux objets récupérables
        const selectedEquipement: Equipement[] = [];
        for (let i = 0; i < 2; i++) {
            if (EquipementToChooseFrom.length === 0) break;
            const randomIndex = Math.floor(Math.random() * EquipementToChooseFrom.length);
            selectedEquipement.push(EquipementToChooseFrom[randomIndex]);
            EquipementToChooseFrom.splice(randomIndex, 1);
        }

        // Appel de la modal
        HUD.createEquipementSelectionModal(selectedEquipement, (selectedEquipement: Equipement) => {
            const playerStats = PlayerStatsService.playerStats;
            const playerEquipement: Equipement[] = []
            playerEquipement.push(selectedEquipement)
            PlayerStatsService.addEquipementStats(selectedEquipement);
            HUD.updatePlayerStats(playerStats);
        });
    }
}
