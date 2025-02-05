import Model from './game/model.js';
import View from './game/view.js';
import Controller from './game/controller.js';
import { GeneticAlgorithm } from './ai/GeneticAlgorithm.js';

// Initialisation des composants principaux du jeu
const model = new Model();
const view = new View();
const controller = new Controller(model, view);

// Configuration de l'algorithme génétique
const POPULATION_SIZE = 100; // Taille de la population
const INPUT_SIZE = 6; // Nombre d'entrées du réseau de neurones
const NB_NEURONNES = 4; // Nombre de neurones dans la couche cachée
const OUTPUT_SIZE = 3; // Nombre de sorties du réseau de neurones
const NUM_BEST = 30; // Nombre d'individus à retenir pour la mutation
const VALEUR_MUTATION = 0.2; // Taux de mutation
const GENERATIONS_LIMIT = 1000; // Nombre maximum de générations

let bestNetwork = null; // Meilleur réseau de neurones trouvé

/**
 * Boucle principale du jeu.
 * Met à jour le modèle et la vue à chaque frame.
 */
function gameLoop() {
    if (!model.isGameOver) {
        controller.update(60); // Mise à jour du contrôleur avec un délai de 60ms
        requestAnimationFrame(gameLoop); // Rappel de la boucle
    }
}

/**
 * Lance le jeu en mode solo.
 * Affiche le canvas unique et démarre la boucle de jeu.
 */
function play() {
    document.getElementById('single-canvas-container').style.display = 'flex';
    document.getElementById('multi-canvas-container').style.display = 'none';
    model.resetGame(); // Réinitialisation du modèle
    model.isGameOver = false; // Démarrage du jeu
    gameLoop(); // Démarrage de la boucle de jeu
}

/**
 * Lance le jeu en mode IA (entraînement).
 * Crée plusieurs canvas pour afficher chaque individu de la population.
 * Initialise et exécute l'algorithme génétique.
 */
function playWithAI() {
    const multiCanvasContainer = document.getElementById('multi-canvas-container');
    multiCanvasContainer.innerHTML = ''; // Réinitialisation du conteneur

    // Création des canvas pour chaque individu de la population
    for (let i = 0; i < POPULATION_SIZE; i++) {
        const canvasContainer = document.createElement('div');
        canvasContainer.style.display = 'flex';
        canvasContainer.style.flexDirection = 'column';
        canvasContainer.style.alignItems = 'center';
        canvasContainer.style.margin = '10px';

        const scoreElement = document.createElement('span');
        scoreElement.id = `score_${i}`;
        scoreElement.innerText = 'Score: 0';
        canvasContainer.appendChild(scoreElement);

        const canvas = document.createElement('canvas');
        canvas.id = `my_canvas_${i}`;
        canvas.width = 300;
        canvas.height = 600;
        canvas.style.border = '1px solid red';
        canvasContainer.appendChild(canvas);

        multiCanvasContainer.appendChild(canvasContainer);
    }

    // Affichage du conteneur multi-canvas et masquage du conteneur solo
    document.getElementById('single-canvas-container').style.display = 'none';
    multiCanvasContainer.style.display = 'flex';

    // Chargement de Google Charts et initialisation de l'algorithme génétique
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(() => {
        const geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE, INPUT_SIZE, NB_NEURONNES, OUTPUT_SIZE);
        let generation = 0;

        /**
         * Fonction récursive pour exécuter une génération de l'algorithme génétique.
         */
        const runGeneration = () => {
            if (generation < GENERATIONS_LIMIT) {
                geneticAlgorithm.run(NUM_BEST, VALEUR_MUTATION, () => {
                    geneticAlgorithm.chart.draw(); // Dessine le graphique
                    generation++; // Passe à la génération suivante
                    runGeneration(); // Rappel récursif
                });
            } else {
                // Sélection du meilleur réseau de neurones après l'entraînement
                bestNetwork = geneticAlgorithm.selectBest(geneticAlgorithm.population, 1)[0];
                console.log('Meilleur réseau sélectionné :', bestNetwork);
            }
        };

        runGeneration(); // Démarrage de la première génération
    });
}

// Gestion des événements pour les boutons
document.getElementById('play').addEventListener('click', play);
document.getElementById('play-ia').addEventListener('click', playWithAI);