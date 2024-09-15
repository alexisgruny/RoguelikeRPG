import { Role } from '../types';

export class RoleService {
    // Stocke le rôle sélectionné
    private static selectedRole: Role | null = null;

    // Charge la liste des rôles depuis un fichier JSON
    public static async loadRoles(): Promise<Role[]> {
        try {
            const response = await fetch('/data/roles.json');
            if (!response.ok) {
                throw new Error(`Failed to load roles: HTTP error! status: ${response.status}`);
            }
            return await response.json() as Role[];
        } catch (error) {
            console.error('Error loading roles:', error);
            throw error; // Relance l'erreur pour permettre la gestion plus haut dans la chaîne
        }
    }

    // Sélectionne un rôle par nom et le stocke dans selectedRole
    public static pickRole(roles: Role[], roleName: string): void {
        const selected = roles.find(role => role.name === roleName);
        if (!selected) {
            throw new Error(`Role '${roleName}' not found`);
        }
        this.selectedRole = selected;
    }

    // Récupère le rôle sélectionné pour l'utiliser dans d'autres parties du jeu
    public static getSelectedRole(): Role | null {
        return this.selectedRole;
    }
}