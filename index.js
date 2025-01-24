import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

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

document.getElementById('play').addEventListener('click', play);
