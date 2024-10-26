import { HUD } from '../ui/HUD';
import { RoleService } from '../components/role';
import { PlayerStats, Skill, Equipement, Consumable } from '../types';

export class PlayerStatsService {

    public static playerSkills: Skill[] = [];
    public static playerEquipement: Equipement[] = [];
    public static playerConsumable: Consumable[] = []

    public static playerStats: PlayerStats = {
        name: 'default',
        health: 100,
        maxHealth: 100,
        attack: 10,
        defense: 10,
        experience: 0,
        level: 1,
        experienceToNextLevel: 3
    };

    // Initialise les stats du joueur en fonction de la classe sélectionnée
    public static initializePlayerStats(): void {
        const selectedClass = RoleService.getSelectedRole();
        if (!selectedClass) {
            throw new Error('Aucune classe sélectionnée pour le joueur');
        }

        // Assigne les stats initiales de la classe sélectionnée
        this.playerStats.name = selectedClass.name;
        this.playerStats.health = selectedClass.health;
        this.playerStats.maxHealth = selectedClass.health;
        this.playerStats.attack = selectedClass.attack;
        this.playerStats.defense = selectedClass.defense;

        // Mise à jour initiale du HUD
        HUD.updatePlayerStats(
            this.playerStats
        );
    }

    // Récupère les stats actuelles du joueur
    public static getPlayerStats() {
        return this.playerStats;
    }

    // Met à jour les stats du joueur après une action
    public static updatePlayerHealth(amount: number): void {
        this.playerStats.health = Math.max(0, this.playerStats.health + amount); // Empêche que la santé descende en dessous de 0
        HUD.updatePlayerStats(this.playerStats);
    }

    // evenement de soin met a jour les Hp du joueurs ( + 30% des Hp max)
    public static campFire(): void {
        this.playerStats.health = Math.min(this.playerStats.maxHealth, this.playerStats.health + (this.playerStats.maxHealth * 0.30));
        HUD.updatePlayerStats(this.playerStats);
    }

    public static addExperience(): void {
        const playerStats = this.getPlayerStats();
        playerStats.experience += 1;
        while (playerStats.experience >= playerStats.experienceToNextLevel) {// Vérifiez si le joueur a suffisamment d'expérience pour monter de niveau
            playerStats.experience -= playerStats.experienceToNextLevel;
            playerStats.level += 1;
            // Afficher les modales pour le choix de la statistique
            this.levelUp(this.playerStats);
        }
    }


    // Fonction pour créer la modale de montée de niveau
    public static levelUp(playerStats: PlayerStats): void {
        const stats = [
            { name: 'Attaque', bonus: Math.floor(Math.random() * 5) + 1 },
            { name: 'Défense', bonus: Math.floor(Math.random() * 5) + 1 },
            { name: 'Points de vie', bonus: Math.floor(Math.random() * 20) + 10 }
        ];

        HUD.createStatModal(stats, (selectedStat: string, bonusValue: number) => {
            switch (selectedStat) {
                case 'Attaque':
                    playerStats.attack = Number(playerStats.attack);
                    playerStats.attack += bonusValue;
                    break;
                case 'Défense':
                    playerStats.defense = Number(playerStats.defense);
                    playerStats.defense += bonusValue;
                    break;
                case 'Points de vie':
                    playerStats.maxHealth = Number(playerStats.maxHealth);
                    playerStats.maxHealth += bonusValue;
                    playerStats.health += bonusValue;
                    break;
            }
            HUD.updatePlayerStats(playerStats);
        });
    }

    public static addSkill(skill: Skill): void {

        // Vérifiez si l'equipement est de type compétence
        if (skill) {
            const newSkill: Skill = {
                id: skill.id,
                name: skill.name,
                skillPoint: skill.skillPoint || 0,
                effectType: skill.effectType,
                abilityName: skill.abilityName,
                amount: skill.amount,
                explanation: skill.explanation
            }

            // Ajoutez la compétence au tableau des compétences du joueur
            this.playerSkills.push(newSkill);
        }
    }

    public static addEquipementStats(equipement: Equipement): void {
        const playerStats: PlayerStats = this.playerStats
        if (equipement) {
            const newEquipement: Equipement = {
                id: equipement.id,
                name: equipement.name,
                description: equipement.description,
                weight: equipement.weight,
                rarity: equipement.rarity,
                statsType: equipement.statsType,
                amount: equipement.amount,
                explanation: equipement.explanation
            }
            switch (newEquipement.statsType) {
                case ('Attaque'):
                    if (newEquipement.amount) {
                        playerStats.attack = Number(playerStats.attack);
                        playerStats.attack += newEquipement.amount;
                    }
                    break;
                case ('Défense'):
                    if (newEquipement.amount) {
                        playerStats.defense = Number(playerStats.defense);
                        playerStats.defense += newEquipement.amount
                    }
                    break;
                case ('Santé'):
                    if (newEquipement.amount) {
                        playerStats.maxHealth = Number(playerStats.maxHealth);
                        playerStats.health = Number(playerStats.health);
                        playerStats.maxHealth += newEquipement.amount
                        playerStats.health += newEquipement.amount
                    }
                    break;
                default:
                    console.log("erreur dans l'ajout du nouvel équipement")
            };
            this.playerEquipement.push(newEquipement);
            HUD.updatePlayerStats(playerStats);
        }

    }

    public static addConsumable(consumable: Consumable): void {
        const NewConsumable: Consumable = {
            id: consumable.id,
            name: consumable.name,
            description: consumable.description,
            weight: consumable.weight,
            effectType: consumable.effectType,
            amount: consumable.amount,
            explanation: consumable.explanation
        }
        this.playerConsumable.push(NewConsumable)
    }

    public static useConsumable(usedConsumable: Consumable) {


    }
}