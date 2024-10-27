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
    abilities: Ability[];
    loot: { item: string; chance: number }[];
    boss?: boolean;
}

export interface Ability {
    name: string;
    damage: number;
    probabilities: number;
    effect?: 'damage' | 'heal' | 'defense' | 'attack';
    healValue?: number;
    defenseValue?: number;
    attackValue?: number;
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

export interface Skill {
    id: string;
    name: string;
    skillPoint: number;
    description: string;
    weight: number;
    effectType: "damage" | "heal";
    abilityName: string;
    amount: number;
    explanation: string;
    rarity: "commun" | "rare" | "epic" | "légendaire" | "boss";
}

export interface Equipement {
    id: string;
    name : string;
    description: string;
    weight: number;
    effectType: "Attaque" | "Défense" | "Santé";
    amount: number;
    explanation: string;
    rarity: "commun" | "rare" | "epic" | "légendaire" | "boss";
}

export interface Consumable {
    id: string;
    name : string;
    description: string;
    weight: number;
    effectType: "damage" | "heal";
    amount: number;
    explanation: string;
    rarity: "commun" | "rare" | "epic" | "légendaire" | "boss";
}