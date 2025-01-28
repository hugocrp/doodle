import { Platform, Player } from './gameObject.js';

class Model {
    static GRAVITY = 20;
    static JUMP_FORCE = 600;
    static SPEED = 200;
    static PLATFORM_WIDTH = 50;
    static PLATFORM_HEIGHT = 10;
    static PLATFORM_COUNT = 100;

    constructor() {
        this.isGameOver = false;
        this.score = 0;
        this.direction = 0;
        this.gravitySpeed = 0;
        this.player = new Player(100, 200, 50, 50);
        this.platforms = this.generatePlatforms();
    }

    bindDisplay(callback) {
        this.displayCallback = callback;
    }

    move(fps) {
        this.gravitySpeed += Model.GRAVITY;
        this.player.position.y += this.gravitySpeed / fps;
        this.player.position.x += this.direction * Model.SPEED / fps;

        if (this.player.position.y > 400) {
            this.jump();
        }

        if (this.player.position.x > 300) {
            this.player.position.x = 0;
        } else if (this.player.position.x < 0) {
            this.player.position.x = 300;
        }
        
        this._generateNewPlatforms();   
        this.updatePlatforms();
        this.sliding();
        this.checkPlatformCollision();
        this.checkDeath();
        this.displayCallback(this.player, this.platforms);
    }

    jump() {
        this.gravitySpeed = -Model.JUMP_FORCE;
    }

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

    updatePlatforms() {
        this.platforms.forEach(platform => platform.update());
    }

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

    checkPlatformCollision() {
        this.platforms.forEach(platform => {
            if (
                this.player.position.x < platform.position.x + platform.width &&
                this.player.position.x + this.player.width > platform.position.x &&
                this.player.position.y + this.player.height > platform.position.y &&
                this.player.position.y + this.player.height < platform.position.y + platform.height &&
                this.gravitySpeed > 0
            ) {
                this.jump();
                if (platform.color === 'gray') {
                    this.platforms = this.platforms.filter(p => p !== platform);
                }
            }
        });
    }

    checkDeath() {
        if (this.player.position.y > 600) {
            this.isGameOver = true;
            this.resetGame();
        }
    }

    resetGame() {
        this.player.position = { x: 100, y: 200 };
        this.score = 0;
        this.platforms = this.generatePlatforms();
        document.getElementById('score').innerText = this.score;
    }

    sliding() {
        if (this.player.position.y < 200) {
            const sliding = 200 - this.player.position.y;
            this.score += sliding;
            document.getElementById('score').innerText = this.score;
            this.player.position.y = 200;
            this.platforms.forEach(platform => (platform.position.y += sliding));
        }
    }

    setDirection(value) {
        this.direction = value;
    }
}

export default Model;