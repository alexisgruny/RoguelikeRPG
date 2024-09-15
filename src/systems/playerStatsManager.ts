import { HUD } from '../ui/HUD';
import { RoleService} from '../components/role';

export class PlayerStatsService {

    private static playerStats = {
        health: 100,
        maxHealth: 100,
        attack: 10,
        defense: 10
    };

    // Initialise les stats du joueur en fonction de la classe sélectionnée
    public static initializePlayerStats() {
        const selectedClass = RoleService.getSelectedRole();
        if (!selectedClass) {
            throw new Error('Aucune classe sélectionnée pour le joueur');
        }

        // Assigne les stats initiales de la classe sélectionnée
        this.playerStats.health = selectedClass.health;
        this.playerStats.maxHealth = selectedClass.health;
        this.playerStats.attack = selectedClass.attack;
        this.playerStats.defense = selectedClass.defense;

        // Mise à jour initiale du HUD
        HUD.updatePlayerStats(
            this.playerStats.health,
            this.playerStats.maxHealth,
            this.playerStats.attack,
            this.playerStats.defense
        );
    }

    // Récupère les stats actuelles du joueur
    public static getPlayerStats() {
        return this.playerStats;
    }

    // Met à jour les stats du joueur après une action
    public static updatePlayerHealth(amount: number): void {
        this.playerStats.health = Math.max(0, this.playerStats.health + amount); // Empêche que la santé descende en dessous de 0
        HUD.updatePlayerStats(
            this.playerStats.health,
            this.playerStats.maxHealth,
            this.playerStats.attack,
            this.playerStats.defense
        );
    }

    // evenement de soin met a jour les Hp du joueurs ( + 30% des Hp max)
    public static campFire(){
        this.playerStats.health = this.playerStats.health + (this.playerStats.maxHealth*0.30);
        HUD.updatePlayerStats(
            this.playerStats.health,
            this.playerStats.maxHealth,
            this.playerStats.attack,
            this.playerStats.defense
        );
    }
}