/**
 * Classe View : Gère l'affichage du jeu.
 */
class View {
    /**
     * Constructeur de la vue.
     * @param {string} canvasId - ID du canvas.
     * @param {string} scoreId - ID de l'élément du score.
     */
    constructor(canvasId = 'my_canvas', scoreId = 'score') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById(scoreId);
        this.holdRight = false; // État de la touche droite
        this.holdLeft = false; // État de la touche gauche
        this._lastDirection = 0; // Dernière direction du joueur
        this._widthCell = 57; // Largeur d'une cellule en pixels
        this._heightCell = 17; // Hauteur d'une cellule en pixels

        // Chargement des images
        this.gamesTiles = new Image();
        this.gamesTiles.src = 'assets/img/game-tiles.png';

        this.characterImage = new Image();
        this.characterImage.src = 'assets/img/character.png';

        this.backgroundImage = new Image();
        this.backgroundImage.src = 'assets/img/background.png';

        this.bindEvents(); // Lie les événements clavier
    }

    /**
     * Lie une fonction de rappel pour définir la direction.
     * @param {Function} callback - Fonction de rappel pour définir la direction.
     */
    bindSetDirection(callback) {
        this.setDirectionCallback = callback;
    }

    /**
     * Définit la dernière direction du joueur.
     * @param {number} direction - Direction (-1: gauche, 1: droite).
     */
    setLastDirection(direction) {
        this._lastDirection = direction;
    }

    /**
     * Met à jour le score affiché.
     * @param {number} score - Score actuel.
     */
    updateScore(score) {
        this.scoreElement.innerText = score;
    }

    /**
     * Dessine les vecteurs des plateformes sur le canvas.
     * @param {Player} player - Joueur.
     * @param {EntryVector} entryVectors - Vecteurs des plateformes.
     */
    drawVectors(player, entryVectors) {
        const vectors = [entryVectors.v1, entryVectors.v2, entryVectors.v3, entryVectors.v4];
        for (let i = 0; i < vectors.length; i++) {
            if (vectors[i] != -1) {
                this.ctx.beginPath();
                this.ctx.moveTo(player.position.x, player.position.y);

                if (vectors[i].x != -1 && vectors[i].y != -1) {
                    this.ctx.strokeStyle = vectors[i].color || 'black'; // Couleur par défaut
                    this.ctx.lineWidth = 2;
                    this.ctx.lineTo(vectors[i].x * 300, vectors[i].y * 600);
                }

                this.ctx.stroke();
            }
        }
    }

    /**
     * Affiche le joueur et les plateformes sur le canvas.
     * @param {Player} player - Joueur.
     * @param {Array} platforms - Liste des plateformes.
     */
    display(player, platforms) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Nettoie le canvas

        // Dessine l'arrière-plan
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        // Dessine les plateformes
        platforms.forEach(platform => {
            if (platform.color === "blue") {
                this.ctx.drawImage(this.gamesTiles, 1, 19, this._widthCell, this._heightCell, platform.position.x, platform.position.y, this._widthCell, this._heightCell);
            } else if (platform.color === "gray") {
                this.ctx.drawImage(this.gamesTiles, 1, 55, this._widthCell, this._heightCell, platform.position.x, platform.position.y, this._widthCell, this._heightCell);
            } else {
                this.ctx.drawImage(this.gamesTiles, 1, 1, this._widthCell, this._heightCell, platform.position.x, platform.position.y, this._widthCell, this._heightCell);
            }
        });

        // Dessine le joueur
        this.ctx.save();
        if (this._lastDirection === -1) {
            this.ctx.scale(-1, 1); // Inverse l'image si le joueur va à gauche
            this.ctx.drawImage(
                this.characterImage,
                -player.position.x - player.width,
                player.position.y,
                player.width,
                player.height
            );
        } else {
            this.ctx.drawImage(
                this.characterImage,
                player.position.x,
                player.position.y,
                player.width,
                player.height
            );
        }
        this.ctx.restore();
    }

    /**
     * Lie les événements clavier pour contrôler le joueur.
     */
    bindEvents() {
        document.addEventListener('keydown', evt => {
            if (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') {
                if (evt.key === 'ArrowLeft') {
                    this._lastDirection = -1;
                    this.holdLeft = true;
                    if (this.setDirectionCallback) this.setDirectionCallback(-1);
                } else if (evt.key === 'ArrowRight') {
                    this._lastDirection = 1;
                    this.holdRight = true;
                    if (this.setDirectionCallback) this.setDirectionCallback(1);
                }
            }
        });

        document.addEventListener('keyup', evt => {
            if (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') {
                if (evt.key === 'ArrowLeft') {
                    this.holdLeft = false;
                    if (!this.holdRight && this.setDirectionCallback) this.setDirectionCallback(0);
                } else if (evt.key === 'ArrowRight') {
                    this.holdRight = false;
                    if (!this.holdLeft && this.setDirectionCallback) this.setDirectionCallback(0);
                }
            }
        });
    }
}

export default View;