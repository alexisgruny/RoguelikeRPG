import { Classe } from '../types';

export class ClasseService {
    
    private static selectedClass: Classe | null = null;

    public static async loadClasses(): Promise<Classe[]> {
        const response = await fetch('/data/classes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as Classe[];
    }

    // Sélectionne une classe par nom et la stocke dans selectedClass
    public static pickClass(classes: Classe[], className: string): void {
        const selected = classes.find(classe => classe.name === className);
        if (!selected) {
            throw new Error(`Classe '${className}' not found`);
        }
        this.selectedClass = selected;
    }

    // Récupère la classe sélectionnée pour l'utiliser dans les combats
    public static getSelectedClass(): Classe | null {
        return this.selectedClass;
    }
}

export const player = {
    health: 100,
    attack: 10,
    defense: 5
};