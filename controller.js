
import Model from './model.js';
import View from './view.js';

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.model.bindDisplay(this.view.display.bind(this.view));
        this.view.bindSetDirection(this.model.setDirection.bind(this.model));
    }

    update(fps) {
        this.model.move(fps);
        const vectors = this.model.getVectors(this.model.platforms, this.model.player);
        const entryVectors = this.model.getEntryVectors(vectors);
        this.view.drawVectors(this.model.player, entryVectors);
        this.view.updateScore(this.model.getScore());
    }

    runGameWithNetwork(network, callback, canvasIndex) {
        this.model.resetGame();
        this.model.isGameOver = false;
        let lastScore = this.model.score;
        let timeSinceLastScoreChange = 0;
    
        const gameLoop = () => {
            if (!this.model.isGameOver) {
                this.update(60);
                requestAnimationFrame(gameLoop);
                const vectors = this.model.getVectors(this.model.platforms, this.model.player);
                const inputs = this.model.getEntryVectors(vectors).getVectorArray();
                const output = network.prediction(inputs);
                this.model.setDirection(output);
                this.view.setLastDirection(output);
    
                if (this.model.score === lastScore) {
                    timeSinceLastScoreChange += 1 / 60; 
                    if (timeSinceLastScoreChange >= 6) {
                        this.model.isGameOver = true;
                    }
                } else {
                    lastScore = this.model.score;
                    timeSinceLastScoreChange = 0;
                }
            } else {
                const finalScore = this.model.resetGame();
                callback(finalScore);
            }
        };
    
        gameLoop();
    }

}



export default Controller;
