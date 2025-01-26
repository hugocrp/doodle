class GameObject {
    constructor(posX, posY, width, height) {
        this.position = { x: posX, y: posY };
        this.width = width;
        this.height = height;
    }
}

class Platform extends GameObject {
    constructor(posX, posY, width, height, color) {
        super(posX, posY, width, height);
        this.color = color;
        this.direction = color === 'blue' ? 1 : 0;
    }

    update() {
        if (this.color === 'blue') {
            this.position.x += this.direction;
            if (this.position.x <= 0 || this.position.x + this.width >= 300) {
                this.direction *= -1;
            }
        }
    }
}

class Player extends GameObject {}

export { GameObject, Platform, Player };