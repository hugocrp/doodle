import EntryVector from './EntryVector.js';
import { Platform, Player } from './gameObject.js';
import Vector from './Vector.js';

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

    
    getVectors(platforms, player) {
        const mapWidth = 300;
        const mapHeight = 600;
        const halfWidth = mapWidth / 2;
        const halfHeight = mapHeight / 2;
    
        const quadrants = [
            { xMin: 0, xMax: halfWidth, yMin: 0, yMax: halfHeight }, // Top-left
            { xMin: halfWidth, xMax: mapWidth, yMin: 0, yMax: halfHeight }, // Top-right
            { xMin: 0, xMax: halfWidth, yMin: halfHeight, yMax: mapHeight }, // Bottom-left
            { xMin: halfWidth, xMax: mapWidth, yMin: halfHeight, yMax: mapHeight } // Bottom-right
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


            if (closestPlatform == null) {
                console.log("aaaaaaaaah")
            }
    
            return closestPlatform ? closestPlatform : -1;
        });
    
        return vectors;
    }

    move(fps) {
        this.gravitySpeed += Model.GRAVITY;
        this.player.position.y += this.gravitySpeed / fps;
        this.player.position.x += this.direction * Model.SPEED / fps;

        if (this.player.position.y > 600) {
            this.jump();
        }

        if (this.player.position.x > 300) {
            this.player.position.x = 0;
        } else if (this.player.position.x < 0) {
            this.player.position.x = 300;
        }

        let vectors = this.getVectors(this.platforms, this.player);
        // console.log(vectors)
        let entryVector = new EntryVector(
            new Vector(vectors[0] != -1 ? vectors[0].position.x : -1, vectors[0] != -1 ? vectors[0].position.y : -1, 'red'),
            new Vector(vectors[1] != -1 ? vectors[1].position.x : -1, vectors[1] != -1 ? vectors[1].position.y : -1, 'blue'),
            new Vector(vectors[2] != -1 ? vectors[2].position.x : -1, vectors[2] != -1 ? vectors[2].position.y : -1, 'green'),
            new Vector(vectors[3] != -1 ? vectors[3].position.x : -1, vectors[3] != -1 ? vectors[3].position.y : -1, 'yellow'),
            this.player.position.x,
            this.player.position.y
        );
        console.log(entryVector.getVector());
        
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