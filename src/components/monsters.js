// récupére les information du fichier monsters.json
export async function loadMonsters() {
    const response = await fetch('/src/data/monsters.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// récupére les monstres du biome actuel
export function getMonstersForBiome(biomes, biomeName, monsters) {
    const currentBiome = biomes.find(biome => biome.name === biomeName);
    if (!currentBiome) {
        throw new Error(`Biome '${biomeName}' not found`);
    }
    return monsters.filter(monster =>
        currentBiome.monsters.includes(monster.name)
    );
}

// sélectionne un monstre aléatoire parmis la pool de monstre dans le biome actuel
export function selectRandomMonsters(monsters, numberOfMonsters = 1) {
    const selectedMonsters = [];
    for (let i = 0; i < numberOfMonsters; i++) {
        const randomIndex = Math.floor(Math.random() * monsters.length);
        selectedMonsters.push(monsters[randomIndex]);
    }
    return selectedMonsters;
}