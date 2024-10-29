import { Monster, PlayerStats, Skill } from '../types';
import { HUD } from '../ui/HUD';
import { PlayerStatsService } from '../service/playerManagerService';
import { GameInitializer } from './gameSetup';

export class CombatSystem {

    /**
     * Calcule les dégâts infligés par le joueur au monstre et retourne le résultat.
     * @param monster Le monstre attaqué
     * @returns Un objet contenant les dégâts infligés et si le monstre est vaincu
     */
    public static playerAttack(monster: Monster) {
        const randomFactor = Math.random() * 0.4 + 0.8; // Variation de 20% autour de la valeur de base
        const playerStats = PlayerStatsService.getPlayerStats();
        const baseDamage = Math.max(playerStats.attack - monster.defense, 1);
        const damageToMonster = Math.floor(baseDamage * randomFactor);
        monster.health -= damageToMonster;
        HUD.logAction(`Vous attaquez et infligé ${damageToMonster} de dégâts.`)
        HUD.updateMonsterStats(monster);
        if (monster.health <= 0) {
            this.MonsterDefeated(monster);
        } else {
            this.MonsterNotDefeated();
        }

    }

    /**
     * Applique une compétence du joueur au monstre ou au joueur en fonction du type d'effet de la compétence.
     * @param skill La compétence utilisée
     * @param monster Le monstre ciblé
     */
    public static applyPlayerSkill(skill: Skill, monster: Monster): void {
        HUD.clearLogs();
        const playerStats = PlayerStatsService.getPlayerStats();
        const randomFactor = Math.random() * 0.4 + 0.8; // Variation de 20%

        switch (skill.effectType) {
            case 'damage':
                const baseDamage = skill.amount * playerStats.attack;
                const damage = Math.max(baseDamage - monster.defense, 1);
                const damageToMonster = Math.floor(damage * randomFactor);
                monster.health -= damageToMonster;
                HUD.logAction(`Vous utilisez ${skill.name} et infligez ${damageToMonster} de dégâts à ${monster.name}.`);
                HUD.updateMonsterStats(monster);
                if (monster.health <= 0) {
                    this.MonsterDefeated(monster);
                } else {
                    this.MonsterNotDefeated();
                }

                break;

            case 'heal':
                const healAmount = Math.min(skill.amount, playerStats.maxHealth - playerStats.health);
                playerStats.health += healAmount;

                HUD.logAction(`Vous utilisez ${skill.name} et vous soignez de ${healAmount} points de vie.`);
                HUD.updatePlayerStats(playerStats);
                break;

            default:
                HUD.logAction(`Effet de la compétence ${skill.name} non reconnu.`);
                break;
        }
    }

    /**
     * Effectue une attaque du monstre sur le joueur en choisissant une capacité basée sur les probabilités.
     * @param monster Le monstre qui attaque
     */
    public static monsterAttack(monster: Monster): void {
        const playerStats = PlayerStatsService.getPlayerStats();
        let randomValue = Math.random();
        const ability = monster.abilities.find(a => (randomValue -= a.probabilities) <= 0);

        if (ability) {
            const randomFactor = Math.random() * 0.4 + 0.8;
            switch (ability.effect) {
                case 'damage':
                    const baseDamage = ability.damage ? ability.damage * monster.attack : 0;
                    const damageToPlayer = Math.max(Math.floor(baseDamage * randomFactor) - playerStats.defense, 1);
                    playerStats.health -= damageToPlayer;
                    HUD.logAction(`${monster.name} utilise ${ability.name} et vous inflige ${damageToPlayer} de dégâts.`);
                    PlayerStatsService.updatePlayerHealth(-damageToPlayer);
                    HUD.updatePlayerStats(playerStats);

                    if (playerStats.health <= 0) {
                        HUD.showEventModal('defeat');
                    }
                    break;

                case 'heal':
                    const healValue = ability.healValue ?? 0;
                    monster.health = Math.min(monster.health + healValue, monster.maxHealth);

                    HUD.logAction(`${monster.name} utilise ${ability.name} et se soigne de ${healValue} points de vie!`);
                    HUD.updateMonsterStats(monster);
                    break;

                case 'defense':
                    const defValue = Number(ability.defenseValue ?? 0);
                    monster.defense = Number(monster.defense); // Conversion en nombre
                    monster.defense += defValue;

                    HUD.logAction(`${monster.name} utilise ${ability.name} et renforce sa défense de ${defValue}!`);
                    HUD.updateMonsterStats(monster);
                    break;

                case 'attack':
                    const atkValue = Number(ability.attackValue ?? 0);
                    monster.attack = Number(monster.attack);
                    monster.attack += atkValue;

                    HUD.logAction(`${monster.name} utilise ${ability.name} et renforce son attaque de ${atkValue}!`);
                    HUD.updateMonsterStats(monster);
                    break;

                default:
                    console.log(`${ability.name} n'a pas d'effet spécifique.`);
                    break;
            }
        }
    }

    private static MonsterDefeated(monster: Monster) {
        GameInitializer.handleVictory();
        if (monster) {
            HUD.logAction(`${monster.name} is DEAD!`);
            GameInitializer.currentMonster = null; // Réinitialisation de currentMonster
        }
    }

    private static MonsterNotDefeated() {
        GameInitializer.handleMonsterAttack()
    }
}