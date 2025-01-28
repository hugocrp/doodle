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
    }

    runGameWithNetwork(network) {
        this.model.resetGame();
        this.model.isGameOver = false;
        while (!this.model.isGameOver) {
            const inputs = [
                this.model.player.position.x / 300,
                this.model.player.position.y / 600,
                this.model.gravitySpeed / Model.JUMP_FORCE,
                this.model.direction
            ];
            const output = network.prediction(inputs);
            this.model.setDirection(output[0] > 0.5 ? 1 : output[0] < -0.5 ? -1 : 0);
            this.update(60);
            
        }
        return this.model.score;
    }

    
}

export default Controller;
