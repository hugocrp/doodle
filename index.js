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
const numBest = 15;
const valeurDeMutation = 0.1;

function gameLoop() {
    if (!model.isGameOver) {
        controller.update(60);
        requestAnimationFrame(gameLoop);
    }
}

function play() {
    document.getElementById('single-canvas-container').style.display = 'flex';
    document.getElementById('multi-canvas-container').style.display = 'none';
    model.resetGame();
    model.isGameOver = false;
    gameLoop();
}

function playWithAI(){
    document.getElementById('single-canvas-container').style.display = 'none';
    document.getElementById('multi-canvas-container').style.display = 'flex';
    const geneticAlgorithm = new GeneticAlgorithm(populationSize, inputSize, nbreNeuronnes, outputSize);
    geneticAlgorithm.run(numBest, valeurDeMutation);
  
}

document.getElementById('play').addEventListener('click', play);
document.getElementById('play-ia').addEventListener('click', playWithAI);


