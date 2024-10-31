export function changeBackgroundForBiome(biomebackground: string | undefined): void {
    const backgroundElement = document.getElementById('global-container'); // L'ID de l'élément de fond du jeu
    if (!backgroundElement) {
        console.warn("Element de fond non trouvé");
        return;
    }

    const backgroundUrl = biomebackground;
    if (backgroundUrl) {
        backgroundElement.style.backgroundImage = `url(${backgroundUrl})`;
    } else {
        console.warn(`Aucun fond défini pour le biome`);
        backgroundElement.style.backgroundImage = ''; // Réinitialiser si le biome n'est pas trouvé
    }
}