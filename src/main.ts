import { Menu } from './ui/menu';
import { AppData } from './data/appData';


// Fonction principale exécutée une fois le DOM chargé
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await AppData.loadData();
        Menu.setupMenu();
        console.log("data load", AppData.monsters);
    }
    catch {
        console.error('error');
    }
});