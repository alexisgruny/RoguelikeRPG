export function particuleEffect(targetElement: HTMLElement) {
    for (let i = 0; i < 10; i++) { // Par exemple, créer 10 particules
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Positionner la particule aléatoirement autour de l'élément cible
        const xOffset = Math.random() * 50 - 25; // Valeurs aléatoires pour créer un effet de dispersion
        const yOffset = Math.random() * 50 - 25;

        particle.style.position = 'absolute';
        particle.style.left = `${50 + xOffset}%`; // Ajuster la position en fonction de l'élément cible
        particle.style.top = `${50 + yOffset}%`; // Ajuster la position en fonction de l'élément cible
        particle.style.transition = 'transform 0.5s, opacity 0.5s'; // Transition pour le mouvement et l'opacité
        particle.style.transform = 'translate(-50%, -50%)'; // Centre la particule
        particle.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'; // Couleur de la particule
        particle.style.width = '10px'; // Taille de la particule
        particle.style.height = '10px'; // Taille de la particule
        particle.style.borderRadius = '50%'; // Rendre la particule ronde
        particle.style.opacity = '1';

        targetElement.appendChild(particle);

        // Animation pour faire disparaître la particule
        setTimeout(() => {
            particle.style.transform += ' translateY(-20px)'; // Faire remonter la particule
            particle.style.opacity = '0'; // Faire disparaître la particule
        }, 50); // Délai pour permettre à la particule de s'afficher

        // Retirer la particule après l'animation
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
}