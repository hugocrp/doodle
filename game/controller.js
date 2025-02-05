import Model from './model.js';
import View from './view.js';

/**
 * Classe Controller : Gère les interactions entre le modèle et la vue.
 */
class Controller {
    /**
     * Constructeur du contrôleur.
     * @param {Model} model - Instance du modèle.
     * @param {View} view - Instance de la vue.
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Liaison des méthodes du modèle et de la vue
        this.model.bindDisplay(this.view.display.bind(this.view));
        this.view.bindSetDirection(this.model.setDirection.bind(this.model));
    }

    /**
     * Met à jour l'état du jeu à chaque frame.
     * @param {number} fps - Nombre de frames par seconde.
     */
    update(fps) {
        this.model.move(fps); // Met à jour la position du joueur et des plateformes
        const vectors = this.model.getVectors(this.model.platforms, this.model.player); // Récupère les vecteurs des plateformes
        const entryVectors = this.model.getEntryVectors(vectors); // Transforme les vecteurs en entrées pour l'IA
        this.view.drawVectors(this.model.player, entryVectors); // Dessine les vecteurs sur le canvas
        this.view.updateScore(this.model.getScore()); // Met à jour le score affiché
    }

    /**
     * Lance le jeu avec un réseau de neurones pour contrôler le joueur.
     * @param {NeuralNetwork} network - Réseau de neurones utilisé pour les prédictions.
     * @param {Function} callback - Fonction de rappel appelée à la fin du jeu.
     * @param {number} canvasIndex - Index du canvas pour l'affichage (optionnel).
     */
    runGameWithNetwork(network, callback, canvasIndex) {
        this.model.resetGame(); // Réinitialise le modèle
        this.model.isGameOver = false; // Démarre le jeu
        let lastScore = this.model.score; // Dernier score enregistré
        let timeSinceLastScoreChange = 0; // Temps écoulé depuis le dernier changement de score

        /**
         * Boucle de jeu pour l'IA.
         */
        const gameLoop = () => {
            if (!this.model.isGameOver) {
                this.update(60); // Met à jour le jeu
                requestAnimationFrame(gameLoop); // Rappel de la boucle

                // Récupère les entrées pour le réseau de neurones
                const vectors = this.model.getVectors(this.model.platforms, this.model.player);
                const inputs = this.model.getEntryVectors(vectors).getVectorArray();
                const output = network.prediction(inputs); // Prédiction du réseau de neurones

                this.model.setDirection(output); // Applique la direction prédite
                this.view.setLastDirection(output); // Met à jour la direction affichée

                // Vérifie si le score a changé
                if (this.model.score === lastScore) {
                    timeSinceLastScoreChange += 1 / 60; // Incrémente le temps écoulé
                    if (timeSinceLastScoreChange >= 6) {
                        this.model.isGameOver = true; // Fin du jeu si le score n'a pas changé pendant 6 secondes
                    }
                } else {
                    lastScore = this.model.score; // Met à jour le dernier score
                    timeSinceLastScoreChange = 0; // Réinitialise le compteur
                }
            } else {
                const finalScore = this.model.resetGame(); // Réinitialise le jeu et récupère le score final
                callback(finalScore); // Appelle la fonction de rappel avec le score final
            }
        };

        gameLoop(); // Démarre la boucle de jeu
    }
}

export default Controller;