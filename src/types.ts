export interface Player {
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
}