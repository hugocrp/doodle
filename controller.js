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
    }
}

export default Controller;
