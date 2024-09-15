import { Monster, Biome, Role, PlayerStats } from '../types';
import { RoleService } from '../components/role';

export class HUD {
    // Mise à jour des stats du joueur à l'écran
    public static updatePlayerStats(playerStats: PlayerStats): void{
        const nameElement = document.getElementById('player-role');
        const healthElement = document.getElementById('player-health');
        const attackElement = document.getElementById('player-attack');
        const defenseElement = document.getElementById('player-defense');
        const lvlElement = document.getElementById('player-lvl');
        const xpElement = document.getElementById('player-xp');

        if (nameElement) nameElement.textContent = `${playerStats.name}`;
        if (healthElement) healthElement.textContent = `Health: ${playerStats.health}/${playerStats.maxHealth}`;
        if (attackElement) attackElement.textContent = `Attack: ${playerStats.attack}`;
        if (defenseElement) defenseElement.textContent = `Defense: ${playerStats.defense}`;
        if (lvlElement) lvlElement.textContent = `Niveau: ${playerStats.level}`;
        if (xpElement) xpElement.textContent = `expérience: ${playerStats.experience}/${playerStats.experienceToNextLevel}`;
    }

    public static updateMonsterStats(monster: Monster) {
        const monsterNameElem = document.getElementById('monster-name')!;
        const monsterHealthElem = document.getElementById('monster-health') as HTMLDivElement;
        const monsterAttackElem = document.getElementById('monster-attack') as HTMLDivElement;
        const monsterDefenseElem = document.getElementById('monster-defense') as HTMLDivElement;

        if (monsterNameElem) monsterNameElem.textContent = `${monster.name}`;
        if (monsterHealthElem) monsterHealthElem.textContent = `Vie: ${monster.health}`;
        if (monsterAttackElem) monsterAttackElem.textContent = `Attaque: ${monster.attack}`;
        if (monsterDefenseElem) monsterDefenseElem.textContent = `Défense: ${monster.defense}`;
    }

    public static logAction(action: string) {
        const logOutputElem = document.getElementById('log-output') as HTMLDivElement;
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }

    public static logRemove() {
       const logRemover = document.getElementById('log-output') as HTMLDivElement;
       logRemover.textContent = "";

    }

    public static showModal(
        eventType: 'victory' | 'defeat' | 'final-victory' | 'heal' | 'merchant' | 'upgrade' | 'boss-battle'
    ) {
        const modal = document.getElementById(`modal`) as HTMLDivElement;
        const title = document.getElementById(`modal-title`) as HTMLHeadingElement;
        const message = document.getElementById(`modal-message`) as HTMLParagraphElement;
        const closeButton = document.getElementById(`close-modal-button`)!;

        // Supprimer l'écouteur précédent pour éviter les doublons
        closeButton.removeEventListener('click', this.closeModal);

        // Configurer le contenu en fonction du type et du résultat
        switch (eventType) {
            case 'victory':
                title.textContent = 'Victoire!';
                message.textContent = 'Vous avez tué le monstre!';
                break;
            case 'defeat':
                title.textContent = 'Perdu...';
                message.textContent = 'Vous êtes mort';
                closeButton.addEventListener('click', () => window.location.reload());
                break;
            case 'final-victory':
                title.textContent = 'Final Victory!';
                message.textContent = 'Bien joué! Vous avez tué tous les monstres!';
                closeButton.addEventListener('click', () => window.location.reload());
                break;
            case 'heal':
                title.textContent = 'Vous faites un feu de camp';
                message.textContent = 'Vous sentez la chaleur du feu de camp vous revigorer.';
                break;
            case 'merchant':
                title.textContent = 'Vous rencontrez un marchand';
                message.textContent = 'Vous avez rencontré un marchand vous pouvez lui acheter des objets.';
                break;
            case 'upgrade':
                title.textContent = 'Vous trouvez un marteau au sol';
                message.textContent = 'Vous pouvez utiliser le marteau pour améliorer un équipement.';
                break;
            case 'boss-battle':
                title.textContent = 'Une entité Mystique vous attaque';
                message.textContent = 'Vous affrontez le roi de la zone bonne chance.';
                break;
        }

        // Ajouter l'écouteur pour fermer la modal
        closeButton.addEventListener('click', this.closeModal);

        // Afficher la modal
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
    // ferme la modal
    private static closeModal() {
        const modals = document.querySelectorAll('.modal') as NodeListOf<HTMLDivElement>;
        modals.forEach((modal) => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        });
    }
}







