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

export interface ItemEffect {
    tier: number;
    abilityName?: string;
    damage?: number;
    healValue?: number;
    amount?: number;
    explanation: string;
}

export interface Items {
    id: string;
    name: string;
    description: string;
    type: "compétence" | "équipement" | "consommable";
    skillPoint?: number;
    weight: number;
    effectType?: "damage" | "heal";
    statsType?: "Attaque" | "Défense" | "Santé";
    effects: ItemEffect[];
    rarity: "commun" | "rare" | "epic" | "légendaire" | "boss";
}

export interface Skills {
    id: string;
    name: string;
    skillPoint?: number
    effectType?: "damage" | "heal";
    effects: ItemEffect[];
}

export interface Equipement {
    id: string;
    name : string;
    description: string;
    weight: number;
    statsType?: "Attaque" | "Défense" | "Santé";
    effects: ItemEffect[];
    rarity: "commun" | "rare" | "epic" | "légendaire" | "boss";
}

export interface Consumable {
    id: string;
    name : string;
    description: string;
    weight: number;
    effectType?: "damage" | "heal";
    effects: ItemEffect[];
}