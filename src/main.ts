import { GameInitializer } from './systems/gameSetup';
import { AppData } from './data/appData';
import { Menu } from './ui/menu';


// Fonction principale exécutée une fois le DOM chargé
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await AppData.loadData();
        Menu.subMenuSetup();
        GameInitializer.InitialyzeGame();     
    }
    catch {
        console.error('error');
    }
});