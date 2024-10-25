import { Monster, PlayerStats, Skills } from '../types';
import { HUD } from '../ui/HUD';
import { CombatManager } from './combatManager';
import { PlayerStatsService } from './playerStatsManager';

export class CombatSystem {

    public static monster : Monster;

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

    public static applyPlayerSkill(skill: Skills): void {
        const playerStats = PlayerStatsService.getPlayerStats();
        const randomFactor = Math.random() * (1.2 - 0.8) + 0.8; // Variation aléatoire

        switch (skill.effects) {
            case 'damage':
                let damage = skill.damage * playerStats.attack;
                damage = Math.max(damage - monster.defense, 1);
                const damageToMonster = Math.floor(damage * randomFactor);
                this.monster.health -= damageToMonster;
                HUD.logAction(`Vous utilisez ${skill.name} et infligez ${damageToMonster} de dégâts à ${monster.name}.`);
                HUD.updateMonsterStats(monster);
                break;

            case 'heal':
                const healValue = skill.healValue;
                playerStats.health = Math.min(playerStats.health + healValue, playerStats.maxHealth);
                HUD.logAction(`Vous utilisez ${skill.name} et vous soignez de ${healValue} points de vie.`);
                HUD.updatePlayerStats(playerStats);
                PlayerStatsService.updatePlayerHealth(healValue);
                break;

            case 'defense':
                const defValue = skill.defenseValue;
                playerStats.defense += defValue;
                HUD.logAction(`Vous utilisez ${skill.name} et renforcez votre défense de ${defValue}.`);
                HUD.updatePlayerStats(playerStats);
                break;

            case 'attack':
                const atkValue = skill.attackValue;
                playerStats.attack += atkValue;
                HUD.logAction(`Vous utilisez ${skill.name} et augmentez votre attaque de ${atkValue}.`);
                HUD.updatePlayerStats(playerStats);
                break;

            default:
                console.log(`${skill.name} n'a pas d'effet spécifique.`);
                break;
        }
    }

    public static monsterAttack(monster: Monster): void {
        const playerStats = PlayerStatsService.getPlayerStats();
        const randomValue = Math.random();
        let accumulatedProbability = 0;
        const ability = monster.abilities.find(a => {
            accumulatedProbability += a.probabilities;
            return randomValue <= accumulatedProbability;
        });
        let playerDefeated = null
        const min = 1 - 0.2;
        const max = 1 + 0.2;
        const randomFactor = Math.random() * (max - min) + min;

        if (ability) {
            // Switch sur le type d'effet de l'attaque (dommage, soin, etc.)
            switch (ability.effect) {
                case 'damage':
                    let damage = ability.damage * monster.attack;
                    damage = Math.max(damage - monster.defense, 1);
                    const damageToPlayer = Math.floor(damage * randomFactor);
                    playerStats.health -= damageToPlayer;
                    HUD.logAction(`${monster.name} utilise ${ability.name} et vous inflige ${damage} de dégats`);
                    playerDefeated = playerStats.health <= 0;
                    PlayerStatsService.updatePlayerHealth(-damageToPlayer);
                    HUD.updatePlayerStats(playerStats);
                    if (playerDefeated) HUD.showEventModal('defeat');
                    break;

                case 'heal':
                    const healValue = Number(ability.healValue);
                    monster.health = Math.min(monster.health + healValue, monster.maxHealth);
                    HUD.logAction(`${monster.name} utilise ${ability.name} se soigne de ${healValue} points de vie!`);
                    HUD.updateMonsterStats(monster);
                    break;

                case 'defense':
                    const defValue = Number(ability.defenseValue);
                    monster.defense += defValue;
                    HUD.logAction(`${monster.name} utilise ${ability.name} et renforce sa défence de ${defValue} !`);
                    HUD.updateMonsterStats(monster);
                    break;

                case 'attack':
                    const atkValue = Number(ability.attackValue);
                    monster.attack += atkValue;
                    HUD.logAction(`${monster.name} utilise ${ability.name} et renforce son attaque de ${atkValue} !`);
                    HUD.updateMonsterStats(monster);
                    break;

                default:
                    console.log(`${ability.name} n'a pas d'effet spécifique.`);
                    break;
            }
        }
    }
}