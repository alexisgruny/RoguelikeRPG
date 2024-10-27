import { Skill, Equipement, Consumable } from "types";
import { SkillService } from "../components/skill";
import { ConsumableService } from "../components/consumable";
import { EquipementService } from "../components/equipement";
import { PlayerStatsService } from "./playerStatsManager";
import { HUD } from "../ui/HUD";

export class ItemService {
    // Déclaration des interfaces
    private static equipement: Equipement[];
    private static skill: Skill[];
    private static consumable: Consumable[];

    // Charge les items et les met dans un tableau 
    private static async loadItems(): Promise<(Equipement | Skill | Consumable)[]> {
        this.equipement = await EquipementService.loadEquipement();
        this.skill = await SkillService.loadSkill();
        this.consumable = await ConsumableService.loadConsumable();

        // Combine les tableaux d'équipements, de compétences et de consommables en un seul tableau
        const itemPull: (Equipement | Skill | Consumable)[] = [];
        itemPull.push(...this.equipement, ...this.skill, ...this.consumable);
        return itemPull;
    }

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
        const itemPull = await ItemService.loadItems();

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
            PlayerStatsService.addEquipementStats(chosenItem);
            HUD.updatePlayerStats(playerStats);
        });
    }
}


