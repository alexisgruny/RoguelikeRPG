import { Skill, Equipement, Consumable } from "types";
import { PlayerStatsService } from "./playerManagerService";
import { HUD } from "../ui/HUD";
import { AppData } from '../data/appData';

export class ItemService {

    // Donne une valeur de probabilité aux objets
    public static getDropChance(rarity: string, battleCount: number): number {
        const rarityMultiplier: Record<string, number> = {
            common: 0.5,
            uncommon: 0.3,
            rare: 0.15,
            legendary: 0.05
        };
        return rarityMultiplier[rarity] + (battleCount * 0.05);
    }

    // Fonction de proposition et de choix d'équipement
    public static async chooseItem(battleCount: number) {
        const itemPull = AppData.items;

        // Fonction de garde pour s'assurer que les items ont une propriété 'rarity'
        function hasRarity(item: any): item is { rarity: string } {
            return typeof item.rarity === 'string';
        }

        // Filtrer les items basés sur leur probabilité de drop
        const itemToChooseFrom = itemPull.filter(item => {
            if (hasRarity(item)) {
                const dropChance = this.getDropChance(item.rarity, battleCount);
                return Math.random() < dropChance;
            }
            return false;
        });

        // Limiter à deux objets récupérables
        const selectedItem: (Equipement | Skill | Consumable)[] = []; // Correction ici
        for (let i = 0; i < 2; i++) {
            if (itemToChooseFrom.length === 0) break;
            const randomIndex = Math.floor(Math.random() * itemToChooseFrom.length);
            selectedItem.push(itemToChooseFrom[randomIndex]);
            itemToChooseFrom.splice(randomIndex, 1); // Supprime l'item sélectionné de la liste
        }

        // Appel de la modale pour sélectionner l'équipement
        HUD.createEquipementSelectionModal(selectedItem, (chosenItem) => {
            const playerStats = PlayerStatsService.playerStats;

            // Ajouter l'item choisi au joueur
            switch (chosenItem.type) {
                case ('compétence'):
                    PlayerStatsService.addSkill(chosenItem);
                    break;
                case ('équipement'):
                    PlayerStatsService.addEquipementStats(chosenItem);
                    HUD.updatePlayerStats(playerStats);
                    break;
                case ('consommable'):
                    PlayerStatsService.addConsumable(chosenItem);
                    break;
                default:

                    break;
            }
        });
    }
}


