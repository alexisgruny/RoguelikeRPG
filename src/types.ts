export interface Classe {
    name:string;
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