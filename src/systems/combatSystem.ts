import { Monster, PlayerStats, Skill } from '../types';
import { HUD } from '../ui/HUD';
import { CombatManager } from './gameManager';
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

    public static applyPlayerSkill(skill: Skill, monster: Monster): void {
        const playerStats = PlayerStatsService.getPlayerStats();
        const randomFactor = Math.random() * (1.2 - 0.8) + 0.8; // Variation aléatoire

        switch (skill.effectType) {
            case 'damage':
                // Parcourt tous les effets de la compétence pour appliquer les effets "damage"
                        let damage = skill.amount * playerStats.attack;
                        damage = Math.max(damage - monster.defense, 1);
                        const damageToMonster = Math.floor(damage * randomFactor);
                        monster.health -= damageToMonster;
                        HUD.logAction(`Vous utilisez ${skill.name} et infligez ${damageToMonster} de dégâts à ${monster.name}.`);
                        HUD.updateMonsterStats(monster);

                break;
            case 'heal':
                // Parcourt tous les effets de la compétence pour appliquer les effets "heal"
                        const healAmount = skill.amount; // ou une autre propriété si nécessaire
                        playerStats.health = Math.min(playerStats.health + healAmount, playerStats.maxHealth);
                        HUD.logAction(`Vous utilisez ${skill.name} et vous soignez de ${healAmount} points de vie.`);
                        HUD.updatePlayerStats(playerStats);
                break;
        
            // Ajoute d'autres cas selon les types d'effets que tu veux traiter
            default:
                HUD.logAction(`Effet de la compétence ${skill.name} non reconnu.`);
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