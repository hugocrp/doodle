export default class Vector {
    constructor(x, y, color) {
        if (x !== -1 && y !== -1) {
            this.x = x / 300; // val normalisé de x
            this.y = y / 600; // val normalisé de y    
        }
        else {
            this.x = x;
            this.y = y;
        }
        this.color = color;
    }

    // renvoie la magnitude
    getMagnitude() {
        if (this.x == -1 && this.y == -1) {
            return -1;
        }

        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
}