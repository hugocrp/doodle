/**
 * Classe EntryVector : Représente les vecteurs d'entrée pour le réseau de neurones.
 */
class EntryVector {
    /**
     * Constructeur de EntryVector.
     * @param {Vector} v1 - Vecteur 1.
     * @param {Vector} v2 - Vecteur 2.
     * @param {Vector} v3 - Vecteur 3.
     * @param {Vector} v4 - Vecteur 4.
     * @param {number} playerPosX - Position horizontale du joueur.
     * @param {number} playerPosY - Position verticale du joueur.
     */
    constructor(v1, v2, v3, v4, playerPosX, playerPosY) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.v4 = v4;
        this.playerRelativeX = playerPosX / 300; // Normalisation de la position X
        this.playerRelativeY = playerPosY / 600; // Normalisation de la position Y
    }

    /**
     * Retourne les vecteurs sous forme d'objet.
     * @returns {Object} - Vecteurs et positions normalisées.
     */
    getVector() {
        return {
            v1: this.v1.getMagnitude(),
            v2: this.v2.getMagnitude(),
            v3: this.v3.getMagnitude(),
            v4: this.v4.getMagnitude(),
            playerRelativeX: this.playerRelativeX,
            playerRelativeY: this.playerRelativeY
        };
    }

    /**
     * Retourne les vecteurs sous forme de tableau.
     * @returns {Array} - Vecteurs et positions normalisées sous forme de tableau.
     */
    getVectorArray() {
        return [
            this.v1.getMagnitude(),
            this.v2.getMagnitude(),
            this.v3.getMagnitude(),
            this.v4.getMagnitude(),
            this.playerRelativeX,
            this.playerRelativeY
        ];
    }
}

export { EntryVector };