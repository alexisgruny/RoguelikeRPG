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
    id: string;
    name: string;
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    abilities: Ability[];   // Liste des compétences (abilities)
    loot: { item: string; chance: number }[];  // Butin avec une chance d'apparition
    boss?: boolean;         // Indique si le monstre est un boss
}

export interface Ability {
    name: string;  
    damage: number;  
    probabilities: number;  
    effect: 'damage' | 'heal' | 'defense' | 'attack';  
    healValue: number; 
    defenseValue: number;
    attackValue: number;     
}

export interface Items {
    name: string;
    attack: number;
    defense: number;
    health: number;
    effect: Text;
}

export interface PlayerStats {
    name: string;
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    experience: number;
    level: number;
    experienceToNextLevel: number;
}