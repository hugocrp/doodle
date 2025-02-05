import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';
import { GeneticAlgorithm } from './geneticAlgorithm.js';

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

const populationSize = 100;
const inputSize = 6;
const nbreNeuronnes = 6;
const outputSize = 3;
const numBest = 30;
const valeurDeMutation = 0.2;
const numGenerations = 1000;
let bestNetwork = null;

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

function playWithAI() {
    const multiCanvasContainer = document.getElementById('multi-canvas-container');
    multiCanvasContainer.innerHTML = '';

    for (let i = 0; i < populationSize; i++) {
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

    document.getElementById('single-canvas-container').style.display = 'none';
    multiCanvasContainer.style.display = 'flex';

    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(() => {
        const geneticAlgorithm = new GeneticAlgorithm(populationSize, inputSize, nbreNeuronnes, outputSize);
        let generation = 0;
        const runGeneration = () => {
            if (generation < numGenerations) {
                geneticAlgorithm.run(numBest, valeurDeMutation, () => {
                    geneticAlgorithm.chart.draw();
                    generation++;
                    runGeneration();
                });
            } else {
                bestNetwork = geneticAlgorithm.selectBest(geneticAlgorithm.population, 1)[0];
            }
        };
        runGeneration();
    });
}

function playWithBestAI() {
    if (!bestNetwork) {
        alert('No trained AI available. Please train the AI first.');
        return;
    }

    document.getElementById('single-canvas-container').style.display = 'flex';
    document.getElementById('multi-canvas-container').style.display = 'none';
    model.resetGame();
    model.isGameOver = false;

    const gameLoop = () => {
        if (!model.isGameOver) {
            controller.update(60);
            requestAnimationFrame(gameLoop);
            const vectors = model.getVectors(model.platforms, model.player);
            const inputs = model.getEntryVectors(vectors).getVectorArray();
            const output = bestNetwork.prediction(inputs);
            model.setDirection(output);
        }
    };

    gameLoop();
}

document.getElementById('play').addEventListener('click', play);
document.getElementById('play-ia').addEventListener('click', playWithAI);
document.getElementById('play-best-ia').addEventListener('click', playWithBestAI);