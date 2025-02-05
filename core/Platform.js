import { GameObject } from './GameObject.js';

/**
 * Classe Platform : Représente une plateforme dans le jeu.
 */
class Platform extends GameObject {
    /**
     * Constructeur de Platform.
     * @param {number} posX - Position horizontale initiale.
     * @param {number} posY - Position verticale initiale.
     * @param {number} width - Largeur de la plateforme.
     * @param {number} height - Hauteur de la plateforme.
     * @param {string} color - Couleur de la plateforme.
     */
    constructor(posX, posY, width, height, color) {
        super(posX, posY, width, height); // Appelle le constructeur de GameObject
        this.color = color; // Couleur de la plateforme
        this.direction = color === 'blue' ? 1 : 0; // Direction de déplacement (1: droite, -1: gauche, 0: immobile)
    }

    /**
     * Met à jour la position de la plateforme.
     */
    update() {
        if (this.color === 'blue') {
            this.position.x += this.direction; // Déplace la plateforme
            if (this.position.x <= 0 || this.position.x + this.width >= 300) {
                this.direction *= -1; // Inverse la direction si la plateforme atteint un bord
            }
        }
    }
}

export { Platform };