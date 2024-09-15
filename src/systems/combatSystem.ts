import { Monster } from '../types';
import { HUD } from '../ui/HUD';
import { PlayerStatsService } from './playerStatsManager'; 

export class CombatSystem {
    public static playerAttack(monster: Monster): { damageToMonster: number, monsterDefeated: boolean } {
        let monsterDefeated = null
        const playerStats = PlayerStatsService.getPlayerStats();
        const damageToMonster = Math.max(playerStats.attack - playerStats.defense, 1);
        monster.health -= damageToMonster;
        HUD.updateMonsterStats(monster);
        monsterDefeated = monster.health <= 0;

        return { damageToMonster, monsterDefeated };
    }

    public static monsterAttack(monster: Monster): { damageToPlayer: number, playerDefeated: boolean } {
        const playerStats = PlayerStatsService.getPlayerStats();
        const damageToPlayer = Math.max(monster.attack - playerStats.defense, 1);
        playerStats.health -= damageToPlayer;
        const playerDefeated = playerStats.health <= 0;

        return { damageToPlayer, playerDefeated };
    }
}