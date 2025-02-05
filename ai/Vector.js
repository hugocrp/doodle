/**
 * Classe Vector : Représente un vecteur dans le jeu.
 */
class Vector {
    /**
     * Constructeur de Vector.
     * @param {number} x - Coordonnée X.
     * @param {number} y - Coordonnée Y.
     * @param {string} color - Couleur du vecteur.
     */
    constructor(x, y, color) {
        if (x !== -1 && y !== -1) {
            this.x = x / 300; // Normalisation de X
            this.y = y / 600; // Normalisation de Y
        } else {
            this.x = x;
            this.y = y;
        }
        this.color = color;
    }

    /**
     * Calcule la magnitude du vecteur.
     * @returns {number} - Magnitude du vecteur.
     */
    getMagnitude() {
        if (this.x === -1 && this.y === -1) {
            return -1;
        }
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
}

export { Vector };