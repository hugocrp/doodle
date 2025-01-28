
export default class EntryVector {
    constructor(v1, v2, v3, v4, playerPosX, playerPosY) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.v4 = v4;
        this.playerRelativeX = playerPosX / 300;
        this.playerRelativeY = playerPosY / 600;
    }

    getVector = () => {
        return {
            v1: this.v1.getMagnitude(),
            v2: this.v2.getMagnitude(),
            v3: this.v3.getMagnitude(),
            v4: this.v4.getMagnitude(),
            playerRelativeX: this.playerRelativeX,
            playerRelativeY: this.playerRelativeY
        }
    }

    getVectorArray = () => {
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