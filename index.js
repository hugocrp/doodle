import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';
import { GeneticAlgorithm } from './geneticAlgorithm.js';

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

const populationSize = 100;
const inputSize = 6;
const nbreNeuronnes = 4;
const outputSize = 3;
const numGenerations = 100;
const numBest = 15;
const valeurDeMutation = 0.1;

function gameLoop() {
    if (!model.isGameOver) {
        controller.update(60);
        requestAnimationFrame(gameLoop);
    }
}

function play() {
    model.resetGame();
    model.isGameOver = false;
    gameLoop();
}

function playWithAI(){
    const geneticAlgorithm = new GeneticAlgorithm(populationSize, inputSize, nbreNeuronnes, outputSize);
    geneticAlgorithm.run(numGenerations, numBest, valeurDeMutation);
}

document.getElementById('play').addEventListener('click', play);
document.getElementById('play-ia').addEventListener('click', playWithAI);


