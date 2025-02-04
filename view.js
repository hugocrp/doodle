

class View {
    constructor(canvasId = 'my_canvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.holdRight = false;
        this.holdLeft = false;
        this._lastDirection = 0;
        this._widthCell   = 57; // Largeur d'une cellule en pixel.
        this._heightCell  = 17; // Hauteur d'une cellule en pixel.

        this.gamesTiles = new Image();
        this.gamesTiles.src = 'assets/img/game-tiles.png';

        this.characterImage = new Image();
        this.characterImage.src = 'assets/img/character.png';

        this.backgroundImage = new Image();
        this.backgroundImage.src = 'assets/img/background.png';

        this.bindEvents();
    }

    bindSetDirection(callback) {
        this.setDirectionCallback = callback;
    }

    drawVectors(player, entryVectors) {
        const vectors = [entryVectors.v1, entryVectors.v2, entryVectors.v3, entryVectors.v4];
        for (let i = 0; i < vectors.length; i++) {
            if (vectors[i] != -1) {
                this.ctx.beginPath();
                this.ctx.moveTo(player.position.x, player.position.y);

                if (vectors[i].x != -1 && vectors[i].y != -1) {
                    this.ctx.strokeStyle = vectors[i].color || 'black'; // Default to black if color is not defined
                    this.ctx.lineWidth = 2;
                    this.ctx.lineTo(vectors[i].x * 300, vectors[i].y * 600);
                }

                this.ctx.stroke();
            }
        }
    }

    display(player, platforms) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        platforms.forEach(platform => {
            if(platform.color === "blue"){
                this.ctx.drawImage(this.gamesTiles, 1, 19, this._widthCell, this._heightCell, platform.position.x, platform.position.y, this._widthCell, this._heightCell);
            }else if(platform.color === "gray"){
                this.ctx.drawImage(this.gamesTiles, 1, 55, this._widthCell, this._heightCell, platform.position.x , platform.position.y, this._widthCell, this._heightCell);
            }else{
                this.ctx.drawImage(this.gamesTiles, 1, 1, this._widthCell, this._heightCell, platform.position.x, platform.position.y, this._widthCell, this._heightCell);
            }

            // this.ctx.fillStyle = platform.color;
            // this.ctx.fillRect(platform.position.x, platform.position.y, platform.width, platform.height);
        });

        this.ctx.save();
        
        if (this._lastDirection === -1) {
            this.ctx.scale(-1, 1);
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