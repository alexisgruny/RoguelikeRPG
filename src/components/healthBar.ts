export function updateHealthBar(elementId: string, currentHealth: number, maxHealth: number): void {
    const healthFill = document.getElementById(elementId) as HTMLElement;
    if (healthFill) {
        const healthPercentage = (currentHealth / maxHealth) * 100;
        healthFill.style.width = `${healthPercentage}%`;
    }
}