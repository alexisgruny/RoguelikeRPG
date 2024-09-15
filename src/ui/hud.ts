import { Monster, Biome, Role } from '../types';

export class HUD {
    // Mise à jour des stats du joueur à l'écran
    public static updatePlayerStats(health: number, maxHealth: number, attack: number, defense: number): void {
        const healthElement = document.getElementById('player-health');
        const attackElement = document.getElementById('player-attack');
        const defenseElement = document.getElementById('player-defense');

        if (healthElement) healthElement.textContent = `Health: ${health}/${maxHealth}`;
        if (attackElement) attackElement.textContent = `Attack: ${attack}`;
        if (defenseElement) defenseElement.textContent = `Defense: ${defense}`;
    }

    public static updateMonsterStats(monster: Monster) {
        const MonsterNameElem = document.getElementById('monster-name')!;
        const monsterHealthElem = document.getElementById('monster-health') as HTMLDivElement;
        monsterHealthElem.textContent = `Vie: ${monster.health}`;
        const monsterAttackElem = document.getElementById('monster-attack') as HTMLDivElement;
        monsterAttackElem.textContent = `Attaque: ${monster.attack}`;
        const monsterDefenseElem = document.getElementById('monster-defense') as HTMLDivElement;
        monsterDefenseElem.textContent = `Défense: ${monster.defense}`;
    }

    public static logAction(action: string) {
        const logOutputElem = document.getElementById('log-output') as HTMLDivElement;
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }

    public static showModal(
        result: 'victory' | 'defeat' | 'final-victory' | 'heal' | 'merchant' | 'upgrade'
    ) {
        const modal = document.getElementById(`modal`) as HTMLDivElement;
        const title = document.getElementById(`modal-title`) as HTMLHeadingElement;
        const message = document.getElementById(`modal-message`) as HTMLParagraphElement;
        const closeButton = document.getElementById(`close-modal-button`)!;

        // Supprimer l'écouteur précédent pour éviter les doublons
        closeButton.removeEventListener('click', this.closeModal);

        // Configurer le contenu en fonction du type et du résultat
        switch (result) {
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







