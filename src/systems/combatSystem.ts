import { Monster } from '../types';
import { player } from '../components/role';
import { HUD } from '../ui/HUD';

export class CombatSystem {
    public static playerAttack(monster: Monster): { damageToMonster: number, monsterDefeated: boolean } {
        let monsterDefeated = null
        const damageToMonster = Math.max(player.attack - monster.defense, 1);
        monster.health -= damageToMonster;
        HUD.updateMonsterStats(monster);
        monsterDefeated = monster.health <= 0;

        return { damageToMonster, monsterDefeated };
    }

    public static monsterAttack(monster: Monster): { damageToPlayer: number, playerDefeated: boolean } {
        const damageToPlayer = Math.max(monster.attack - player.defense, 1);
        player.health -= damageToPlayer;
        const playerDefeated = player.health <= 0;

        return { damageToPlayer, playerDefeated };
    }
}