import { Role } from '../types';
import { PlayerStatsService } from './playerManagerService';

export class RoleService {
    // Stocke le rôle sélectionné
    public static currentRole: Role | null = null;

    // Sélectionne un rôle par nom et le stocke dans selectedRole
    public static pickRole(roles: Role[], roleName: string): void {
        const selectedRole = roles.find(role => role.name === roleName);
        if (!selectedRole) {
            throw new Error(`Role '${roleName}' not found`);
        }
        this.currentRole = selectedRole;
        PlayerStatsService.initializePlayerStats();
    }
}