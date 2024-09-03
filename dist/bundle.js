/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/biome.ts":
/*!*********************************!*\
  !*** ./src/components/biome.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findBiomeByName: () => (/* binding */ findBiomeByName),
/* harmony export */   loadBiomes: () => (/* binding */ loadBiomes)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Charge les informations du fichier biomes.json
function loadBiomes() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/src/data/biomes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return yield response.json();
    });
}
// Exporte la fonction pour trouver un biome par son nom
function findBiomeByName(biomes, biomeName) {
    return biomes.find(biome => biome.name === biomeName);
}


/***/ }),

/***/ "./src/components/monsters.ts":
/*!************************************!*\
  !*** ./src/components/monsters.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMonstersFromBiome: () => (/* binding */ getMonstersFromBiome),
/* harmony export */   loadMonsters: () => (/* binding */ loadMonsters),
/* harmony export */   selectRandomMonsters: () => (/* binding */ selectRandomMonsters)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Charge les informations du fichier monsters.json
function loadMonsters() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/src/data/monsters.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return yield response.json();
    });
}
// Récupère les monstres du biome actuel
function getMonstersFromBiome(biomes, biomeName, monsters) {
    const currentBiome = biomes.find(biome => biome.name === biomeName);
    if (!currentBiome) {
        throw new Error(`Biome '${biomeName}' not found`);
    }
    return monsters.filter(monster => currentBiome.monsters.includes(monster.name));
}
// Sélectionne un ou plusieurs monstres aléatoires parmi ceux disponibles dans le biome actuel
function selectRandomMonsters(monsters, numberOfMonsters = 1) {
    const selectedMonsters = [];
    for (let i = 0; i < numberOfMonsters; i++) {
        const randomIndex = Math.floor(Math.random() * monsters.length);
        selectedMonsters.push(monsters[randomIndex]);
    }
    return selectedMonsters;
}


/***/ }),

/***/ "./src/components/player.ts":
/*!**********************************!*\
  !*** ./src/components/player.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   player: () => (/* binding */ player)
/* harmony export */ });
const player = {
    health: 100,
    attack: 10,
    defense: 5
};


/***/ }),

/***/ "./src/systems/combatSystem.ts":
/*!*************************************!*\
  !*** ./src/systems/combatSystem.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeCombat: () => (/* binding */ initializeCombat),
/* harmony export */   startCombat: () => (/* binding */ startCombat)
/* harmony export */ });
/* harmony import */ var _components_biome__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/biome */ "./src/components/biome.ts");
/* harmony import */ var _components_monsters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/monsters */ "./src/components/monsters.ts");
/* harmony import */ var _components_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/player */ "./src/components/player.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



function startCombat(currentBiomeName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Charger les biomes et les monstres
            const biomes = yield (0,_components_biome__WEBPACK_IMPORTED_MODULE_0__.loadBiomes)();
            const monsters = yield (0,_components_monsters__WEBPACK_IMPORTED_MODULE_1__.loadMonsters)();
            // Obtenir les monstres pour le biome actuel
            const availableMonsters = (0,_components_monsters__WEBPACK_IMPORTED_MODULE_1__.getMonstersFromBiome)(biomes, currentBiomeName, monsters);
            if (availableMonsters.length === 0) {
                throw new Error(`No monsters found for biome '${currentBiomeName}'`);
            }
            // Sélectionner un monstre aléatoire pour le combat
            const selectedMonster = (0,_components_monsters__WEBPACK_IMPORTED_MODULE_1__.selectRandomMonsters)(availableMonsters, 1)[0];
            // Retourner le monstre sélectionné pour le combat
            return selectedMonster;
        }
        catch (error) {
            console.error('Erreur lors du démarrage du combat:', error);
            throw error; // Propager l'erreur pour la gérer dans main.js
        }
    });
}
function initializeCombat(monster) {
    var _a;
    // Références aux éléments HTML
    const playerHealthElem = document.getElementById('player-health');
    const playerAttackElem = document.getElementById('player-attack');
    const playerDefenseElem = document.getElementById('player-defense');
    const monsterNameElem = document.getElementById('monster-name');
    const monsterHealthElem = document.getElementById('monster-health');
    const monsterattackElem = document.getElementById('monster-attack');
    const monsterdefenseElem = document.getElementById('monster-defense');
    const biomeNameElem = document.getElementById('biome-name');
    const logOutputElem = document.getElementById('log-output');
    // Mise à jour des affichages
    function updateDisplay() {
        // Affichage en temps réel des stats
        playerHealthElem.textContent = _components_player__WEBPACK_IMPORTED_MODULE_2__.player.health.toString();
        playerAttackElem.textContent = _components_player__WEBPACK_IMPORTED_MODULE_2__.player.attack.toString();
        playerDefenseElem.textContent = _components_player__WEBPACK_IMPORTED_MODULE_2__.player.defense.toString();
        monsterNameElem.textContent = monster.name;
        monsterHealthElem.textContent = monster.health.toString();
        monsterattackElem.textContent = monster.attack.toString();
        monsterdefenseElem.textContent = monster.defense.toString();
        // Si le biome est disponible (vous devrez ajuster ceci en fonction de votre code)
        biomeNameElem.textContent = "Forêt"; // Remplacer par le nom réel du biome si nécessaire
    }
    // Log des actions dans la zone de combat
    function logAction(action) {
        logOutputElem.textContent += action + "\n";
        logOutputElem.scrollTop = logOutputElem.scrollHeight;
    }
    // Action d'attaque du joueur
    (_a = document.getElementById('attack-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let damageToMonster = _components_player__WEBPACK_IMPORTED_MODULE_2__.player.attack - monster.defense;
        damageToMonster = damageToMonster > 0 ? damageToMonster : 1;
        monster.health -= damageToMonster;
        logAction(`Player attacks ${monster.name} for ${damageToMonster} damage!`);
        if (monster.health <= 0) {
            logAction(`${monster.name} defeated!`);
            monster.health = 0;
        }
        else {
            monsterAttack();
        }
        updateDisplay();
    });
    // Attaque du monstre après l'attaque du joueur
    function monsterAttack() {
        let damageToPlayer = monster.attack - _components_player__WEBPACK_IMPORTED_MODULE_2__.player.defense;
        damageToPlayer = damageToPlayer > 0 ? damageToPlayer : 1;
        _components_player__WEBPACK_IMPORTED_MODULE_2__.player.health -= damageToPlayer;
        logAction(`${monster.name} attacks for ${damageToPlayer} damage!`);
        if (_components_player__WEBPACK_IMPORTED_MODULE_2__.player.health <= 0) {
            logAction("Player is defeated...");
            _components_player__WEBPACK_IMPORTED_MODULE_2__.player.health = 0;
        }
        updateDisplay();
    }
    // Initialisation de l'affichage
    updateDisplay();
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _systems_combatSystem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./systems/combatSystem */ "./src/systems/combatSystem.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentBiome = 'Foret'; // Exemple de nom de biome
            const selectedMonster = yield (0,_systems_combatSystem__WEBPACK_IMPORTED_MODULE_0__.startCombat)(currentBiome);
            (0,_systems_combatSystem__WEBPACK_IMPORTED_MODULE_0__.initializeCombat)(selectedMonster);
        }
        catch (error) {
            console.error('Erreur dans le main:', error);
        }
    });
}
main();

/******/ })()
;
//# sourceMappingURL=bundle.js.map