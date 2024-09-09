import { Role } from '../types';

export class RoleService {
    
    private static selectedRole: Role | null = null;

    public static async loadRoles(): Promise<Role[]> {
        const response = await fetch('/data/roles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Role[];
    }

    // Sélectionne une Role par nom et la stocke dans selectedRole
    public static pickRole(roles: Role[], roleName: string): void {
        const selected = roles.find(role => role.name === roleName);
        if (!selected) {
            throw new Error(`Role '${ roleName}' not found`);
        }
        this.selectedRole = selected;
    }

    // Récupère la Role sélectionnée pour l'utiliser dans les combats
    public static getSelectedRole(): Role | null {
        return this.selectedRole;
    }
}

export const player = {
    health: 0,
    attack: 0,
    defense: 0
};