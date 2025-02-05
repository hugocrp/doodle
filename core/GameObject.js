/**
 * Classe GameObject : Représente un objet générique dans le jeu.
 */
class GameObject {
    /**
     * Constructeur de GameObject.
     * @param {number} posX - Position horizontale initiale.
     * @param {number} posY - Position verticale initiale.
     * @param {number} width - Largeur de l'objet.
     * @param {number} height - Hauteur de l'objet.
     */
    constructor(posX, posY, width, height) {
        this.position = { x: posX, y: posY }; // Position de l'objet
        this.width = width; // Largeur de l'objet
        this.height = height; // Hauteur de l'objet
    }
}

export { GameObject };