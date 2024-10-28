import { Equipement, Skill, Consumable, Monster, Role, Biome } from "types";

export class AppData {

    public static items: (Equipement | Skill | Consumable)[] = [];
    public static biomes: Biome[];
    public static roles: Role[];
    public static monsters: Monster[];

    // Méthode pour charger les données
    public static async loadData() {
        // Exemple d'appel asynchrone à des services pour charger les données
        const equipements = await this.loadEquipement();
        const skills = await this.loadSkill();
        const consumables = await this.loadConsumable();
        const biomes = await this.loadBiomes();
        const roles = await this.loadRoles();
        const monsters = await this.loadMonsters();

        // Stocke toutes les données dans la variable statique
        this.items = [...equipements, ...skills, ...consumables];
        this.biomes = biomes;
        this.roles = roles;
        this.monsters = monsters;
    }

    public static async loadEquipement(): Promise<Equipement[]> {
        const response = await fetch('/data/equipement.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Equipement[];
    }

    public static async loadSkill(): Promise<Skill[]> {
        const response = await fetch('/data/skill.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Skill[];
    }

    public static async loadConsumable(): Promise<Consumable[]> {
        const response = await fetch('/data/consumable.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Consumable[];
    }

    public static async loadBiomes(): Promise<Biome[]> {
        const response = await fetch('/data/biomes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Biome[];
    }

    public static async loadRoles(): Promise<Role[]> {
        const response = await fetch('/data/roles.json');
        if (!response.ok) {
            throw new Error(`Failed to load roles: HTTP error! status: ${response.status}`);
        }
        return await response.json() as Role[];
    }

    public static async loadMonsters(): Promise<Monster[]> {
            const response = await fetch('/data/monsters.json');
            if (!response.ok) {
                throw new Error(`Failed to load monsters: ${response.statusText}`);
            }
            return await response.json() as Monster[];
    }

}