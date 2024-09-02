// récupére les information du fichier biomes.json
export async function loadBiomes() {
    const response = await fetch('/src/data/biomes.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// exporte la fonction pour avoir les valeurs du biome
export function findBiomeByName(biomes, biomeName) {
    return biomes.find(biome => biome.name === biomeName);
    
}