class View {
    constructor() {
        this.canvas = document.getElementById('my_canvas');
        this.ctx = this.canvas.getContext('2d');
        this.holdRight = false;
        this.holdLeft = false;
        this._lastDirection = 0;

        this.characterImage = new Image();
        this.characterImage.src = 'assets/img/character.png';

        this.backgroundImage = new Image();
        this.backgroundImage.src = 'assets/img/background.png';

        this.bindEvents();
    }

    bindSetDirection(callback) {
        this.setDirectionCallback = callback;
    }

    display(player, platforms) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        platforms.forEach(platform => {
            this.ctx.fillStyle = platform.color;
            this.ctx.fillRect(platform.position.x, platform.position.y, platform.width, platform.height);
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