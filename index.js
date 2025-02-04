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
const numBest = 30;
const valeurDeMutation = 0.1;
const numGenerations = 100;

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

// function playWithAI() {
//     document.getElementById('single-canvas-container').style.display = 'none';
//     document.getElementById('multi-canvas-container').style.display = 'flex';
//     const geneticAlgorithm = new GeneticAlgorithm(populationSize, inputSize, nbreNeuronnes, outputSize);
//     let generation = 0;

//     const runGeneration = () => {
//         if (generation < numGenerations) {
//             geneticAlgorithm.run(numBest, valeurDeMutation, () => {
//                 generation++;
//                 runGeneration();
//             });
//         }
//     };

//     runGeneration();
// }

function playWithAI() {
    const multiCanvasContainer = document.getElementById('multi-canvas-container');
    multiCanvasContainer.innerHTML = '';

    for (let i = 0; i < populationSize; i++) {
        const canvas = document.createElement('canvas');
        canvas.id = `my_canvas_${i}`;
        canvas.width = 300;
        canvas.height = 600;
        canvas.style.border = '1px solid red';
        canvas.style.margin = '10px';
        multiCanvasContainer.appendChild(canvas);
    }

    document.getElementById('single-canvas-container').style.display = 'none';
    multiCanvasContainer.style.display = 'flex';

    const geneticAlgorithm = new GeneticAlgorithm(populationSize, inputSize, nbreNeuronnes, outputSize);
    let generation = 0;

    const runGeneration = () => {
        if (generation < numGenerations) {
            geneticAlgorithm.run(numBest, valeurDeMutation, () => {
                generation++;
                runGeneration();
            });
        }
    };

    runGeneration();
}
document.getElementById('play').addEventListener('click', play);
document.getElementById('play-ia').addEventListener('click', playWithAI);


