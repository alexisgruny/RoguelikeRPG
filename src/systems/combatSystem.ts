import { Monster } from '../types';
import { HUD } from '../ui/HUD';
import { PlayerStatsService } from './playerStatsManager'; 

export class CombatSystem {
    public static playerAttack(monster: Monster): { damageToMonster: number, monsterDefeated: boolean } {
        let monsterDefeated = null
        const min = 1 - 0.2;
        const max = 1 + 0.2;
        const randomFactor = Math.random() * (max - min) + min;
        const playerStats = PlayerStatsService.getPlayerStats();
        const damage = Math.max(playerStats.attack - monster.defense, 1);
        const damageToMonster = Math.floor(damage * randomFactor);
        monster.health -= damageToMonster;
        HUD.updateMonsterStats(monster);
        monsterDefeated = monster.health <= 0;

        return { damageToMonster, monsterDefeated };
    }

    public static monsterAttack(monster: Monster): { damageToPlayer: number, playerDefeated: boolean } {
        const min = 1 - 0.2;
        const max = 1 + 0.2;
        const randomFactor = Math.random() * (max - min) + min;
        const playerStats = PlayerStatsService.getPlayerStats();
        const damage = Math.max(monster.attack - playerStats.defense, 1);
        const damageToPlayer = Math.floor(damage * randomFactor);
        playerStats.health -= damageToPlayer;
        const playerDefeated = playerStats.health <= 0;

        return { damageToPlayer, playerDefeated };
    }
}