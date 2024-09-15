export interface Role {
    name: string;
    health: number;
    attack: number;
    defense: number;
}

export interface Biome {
    name: string;
    monsters: string[];
}

export interface Monster {
    name: string;
    attack: number;
    defense: number;
    health: number;
    maxHealth: number;
}

export interface Items {
    name: string;
    attack: number;
    defense: number;
    health: number;
    effect: Text;
}