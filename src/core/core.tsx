import { Configuration, Cell } from "./core.types";
// Coeur du jeu - Ces fonctions sont suffisantes pour faire fonctionner le jeu

// Génère une configuration aléatoire, choix du nombre de cellules vivantes et de la taille du cadre possible
export function randomConfiguration(cells: number = 500, size: number = 150): Configuration {
  const configuration: Configuration = []
  for (let i = 0; i < cells; i++) {
    const x = (size/3) + Math.floor(Math.random() * (size/3))
    const y = (size/3) + Math.floor(Math.random() * (size/3))
    const index = Math.floor(Math.random() * size * cells / 100)
    configuration[index] = [x, y]
  }
  return configuration
}

// Réalise un tour de configuration (génération de la prochaine configuration à partir d'une configuration donnée)
export function doTurn(configuration: Configuration): Configuration {
  const actualGeneration: Configuration = removeDuplicates(getNeighborsOfEachCell(configuration));
  const nextGeneration: Configuration = actualGeneration.map(cell => (getCellCoordsForNextGen(configuration, cell) as Cell)).filter(Boolean);

  return nextGeneration;
}

export const getNeighborsOfEachCell = (configuration: Configuration): Configuration => {
  return configuration.map(getVoisins).flat()
}

export const getCellCoordsForNextGen = (generation: Configuration, cell: Cell): Cell | null => {
  return processCell(generation, cell, checkIfVoisinExist(generation, cell)) ? ([cell[0], cell[1]]) : null;
}

// Vérifie si une cellule (vivante ou non) pourra vivre sur la prochaine configuration
export const processCell = (generation: Configuration, cell: Cell, isAlive: boolean): boolean => {
  const nbNeighbors = countAliveNeighborsOfaCell(cell, generation);
  if (nbNeighbors === 3) {
    return true;
  }
  else
    return nbNeighbors === 2 && isAlive;
}

export const countAliveNeighborsOfaCell = (cell: Cell, configuration: Configuration): number => {
  let nbAliveNeighbors = 0;
  const neighbors = getVoisins(cell);
  neighbors.forEach(neighbor => checkIfVoisinExist(configuration, neighbor) ? nbAliveNeighbors++ : null);
  return nbAliveNeighbors;
}

// Vérifie si la case adjacente est vivante dans la configuration actuelle
export function checkIfVoisinExist(configuration: Configuration, voisin: Cell): boolean {
  return !!configuration.some(cell => (cell[0] === voisin[0] && cell[1] === voisin[1]));
}

// Récupération des 8 cases adjacentes d'une cellule
export function getVoisins(cell: Cell): Configuration {
  return [
    [cell[0], cell[1] - 1],
    [cell[0], cell[1] + 1],
    [cell[0] + 1, cell[1] - 1],
    [cell[0] + 1, cell[1]],
    [cell[0] + 1, cell[1] + 1],
    [cell[0] - 1, cell[1] - 1],
    [cell[0] - 1, cell[1]],
    [cell[0] - 1, cell[1] + 1],
  ]
}

// Supprime les possibles voisins doublons (pour éviter de les retester)
export function removeDuplicates(voisins: Configuration): Configuration {
  return voisins.reduce((unique: Configuration, voisin: Cell) => {
    if (!unique.some(cell => cell[0] === voisin[0] && cell[1] === voisin[1])) unique.push(voisin);
    return unique;
  }, []);
}
