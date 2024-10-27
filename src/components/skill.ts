import { Skill } from '../types';

export class SkillService {
    // Charge les informations du fichier Equipement.json



    public static async loadSkill(): Promise<Skill[]> {
        const response = await fetch('/data/skill.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Skill[];
    }
}