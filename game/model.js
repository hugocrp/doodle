import { EntryVector } from '../ai/EntryVector.js';
import { Platform } from '../core/Platform.js';
import { Player } from '../core/Player.js';
import { Vector } from '../ai/Vector.js';

/**
 * Classe Model : Gère la logique du jeu.
 */
class Model {
    static GRAVITY = 20; // Force de gravité
    static JUMP_FORCE = 600; // Force de saut
    static SPEED = 200; // Vitesse de déplacement horizontal
    static PLATFORM_WIDTH = 50; // Largeur des plateformes
    static PLATFORM_HEIGHT = 10; // Hauteur des plateformes
    static PLATFORM_COUNT = 100; // Nombre de plateformes générées

    constructor() {
        this.isGameOver = false; // État du jeu
        this.score = 0; // Score actuel
        this.direction = 0; // Direction du joueur (-1: gauche, 1: droite)
        this.gravitySpeed = 0; // Vitesse de chute due à la gravité
        this.player = new Player(100, 200, 50, 50); // Joueur
        this.platforms = this.generatePlatforms(); // Plateformes
    }

    /**
     * Lie une fonction de rappel pour l'affichage.
     * @param {Function} callback - Fonction de rappel pour l'affichage.
     */
    bindDisplay(callback) {
        this.displayCallback = callback;
    }

    /**
     * Récupère les vecteurs des plateformes les plus proches dans chaque quadrant.
     * @param {Array} platforms - Liste des plateformes.
     * @param {Player} player - Joueur.
     * @returns {Array} - Vecteurs des plateformes les plus proches.
     */
    getVectors(platforms, player) {
        const mapWidth = 300; // Largeur de la carte
        const mapHeight = 600; // Hauteur de la carte
        const halfWidth = mapWidth / 2; // Moitié de la largeur
        const halfHeight = mapHeight / 2; // Moitié de la hauteur

        const quadrants = [
            { xMin: 0, xMax: halfWidth, yMin: 0, yMax: halfHeight }, // Quadrant supérieur gauche
            { xMin: halfWidth, xMax: mapWidth, yMin: 0, yMax: halfHeight }, // Quadrant supérieur droit
            { xMin: 0, xMax: halfWidth, yMin: halfHeight, yMax: mapHeight }, // Quadrant inférieur gauche
            { xMin: halfWidth, xMax: mapWidth, yMin: halfHeight, yMax: mapHeight } // Quadrant inférieur droit
        ];

        const vectors = quadrants.map(quadrant => {
            let closestPlatform = null;
            let minDistance = Infinity;

            platforms.forEach(platform => {
                if (
                    platform.position.x >= quadrant.xMin &&
                    platform.position.x <= quadrant.xMax &&
                    platform.position.y >= quadrant.yMin &&
                    platform.position.y <= quadrant.yMax
                ) {
                    const distance = Math.hypot(
                        platform.position.x - player.position.x,
                        platform.position.y - player.position.y
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPlatform = platform;
                    }
                }
            });

            return closestPlatform ? closestPlatform : -1; // Retourne la plateforme la plus proche ou -1 si aucune
        });

        return vectors;
    }

    /**
     * Transforme les vecteurs des plateformes en entrées pour l'IA.
     * @param {Array} vectors - Vecteurs des plateformes.
     * @returns {EntryVector} - Vecteurs d'entrée pour l'IA.
     */
    getEntryVectors(vectors) {
        let entryVector = new EntryVector(
            new Vector(vectors[0] != -1 ? vectors[0].position.x : -1, vectors[0] != -1 ? vectors[0].position.y : -1, 'red'),
            new Vector(vectors[1] != -1 ? vectors[1].position.x : -1, vectors[1] != -1 ? vectors[1].position.y : -1, 'blue'),
            new Vector(vectors[2] != -1 ? vectors[2].position.x : -1, vectors[2] != -1 ? vectors[2].position.y : -1, 'green'),
            new Vector(vectors[3] != -1 ? vectors[3].position.x : -1, vectors[3] != -1 ? vectors[3].position.y : -1, 'yellow'),
            this.player.position.x,
            this.player.position.y
        );

        return entryVector;
    }

    /**
     * Met à jour la position du joueur et des plateformes.
     * @param {number} fps - Nombre de frames par seconde.
     */
    move(fps) {
        this.gravitySpeed += Model.GRAVITY; // Applique la gravité
        this.player.position.y += this.gravitySpeed / fps; // Met à jour la position verticale
        this.player.position.x += this.direction * Model.SPEED / fps; // Met à jour la position horizontale

        if (this.player.position.y > 600) {
            this.jump(); // Fait sauter le joueur s'il tombe en bas de l'écran
        }

        if (this.player.position.x > 300) {
            this.player.position.x = 0; // Téléporte le joueur à gauche s'il sort à droite
        } else if (this.player.position.x < 0) {
            this.player.position.x = 300; // Téléporte le joueur à droite s'il sort à gauche
        }

        this._generateNewPlatforms(); // Génère de nouvelles plateformes
        this.updatePlatforms(); // Met à jour les plateformes
        this.sliding(); // Gère le défilement de l'écran
        this.checkPlatformCollision(); // Vérifie les collisions avec les plateformes
        this.checkDeath(); // Vérifie si le joueur est mort
        this.displayCallback(this.player, this.platforms); // Met à jour l'affichage
    }

    /**
     * Fait sauter le joueur.
     */
    jump() {
        this.gravitySpeed = -Model.JUMP_FORCE; // Applique une force de saut
    }

    /**
     * Génère les plateformes initiales.
     * @returns {Array} - Liste des plateformes générées.
     */
    generatePlatforms() {
        const platforms = [];
        for (let i = 0; i < 10; i++) {
            const posX = Math.random() * (300 - Model.PLATFORM_WIDTH);
            const posY = i * (600 / 10);
            const color = Math.random() < 0.5 ? 'green' : 'blue';
            platforms.push(new Platform(posX, posY, Model.PLATFORM_WIDTH, Model.PLATFORM_HEIGHT, color));
        }
        return platforms;
    }

    /**
     * Met à jour les plateformes.
     */
    updatePlatforms() {
        this.platforms.forEach(platform => platform.update());
    }

    /**
     * Génère de nouvelles plateformes si nécessaire.
     */
    _generateNewPlatforms() {
        const highestPlatform = this.platforms.reduce((max, platform) => 
            platform.position.y < max.position.y ? platform : max, 
            this.platforms[0]
        );

        if (highestPlatform.position.y > 100) {
            let color = Math.random() < 0.5 ? 'green' : Math.random() < 0.5 ? 'blue' : 'gray';
            let posX = Math.random() * (300 - Model.PLATFORM_WIDTH);
            let posY = highestPlatform.position.y - 100;
            this.platforms.push(new Platform(posX, posY, Model.PLATFORM_WIDTH, Model.PLATFORM_HEIGHT, color));
        }
    }

    /**
     * Vérifie les collisions entre le joueur et les plateformes.
     */
    checkPlatformCollision() {
        this.platforms.forEach(platform => {
            if (
                this.player.position.x < platform.position.x + platform.width &&
                this.player.position.x + this.player.width > platform.position.x &&
                this.player.position.y + this.player.height > platform.position.y &&
                this.player.position.y + this.player.height < platform.position.y + platform.height &&
                this.gravitySpeed > 0
            ) {
                this.jump(); // Fait sauter le joueur
                if (platform.color === 'gray') {
                    this.platforms = this.platforms.filter(p => p !== platform); // Supprime les plateformes grises
                }
            }
        });
    }

    /**
     * Vérifie si le joueur est mort.
     */
    checkDeath() {
        if (this.player.position.y > 600) {
            this.isGameOver = true; // Met fin au jeu
            this.resetGame(); // Réinitialise le jeu
        }
    }

    /**
     * Réinitialise le jeu.
     * @returns {number} - Score final.
     */
    resetGame() {
        const finalScore = this.score;
        this.player.position = { x: 100, y: 200 }; // Réinitialise la position du joueur
        this.score = 0; // Réinitialise le score
        this.platforms = this.generatePlatforms(); // Régénère les plateformes
        return finalScore; // Retourne le score final
    }

    /**
     * Récupère le score actuel.
     * @returns {number} - Score actuel.
     */
    getScore() {
        return this.score;
    }

    /**
     * Gère le défilement de l'écran lorsque le joueur monte.
     */
    sliding() {
        if (this.player.position.y < 200) {
            const sliding = 200 - this.player.position.y;
            this.score += Math.ceil(sliding); // Incrémente le score
            this.player.position.y = 200; // Réinitialise la position verticale du joueur
            this.platforms.forEach(platform => (platform.position.y += sliding)); // Déplace les plateformes
        }
    }

    /**
     * Définit la direction du joueur.
     * @param {number} value - Direction (-1: gauche, 1: droite).
     */
    setDirection(value) {
        this.direction = value;
    }
}

export default Model;