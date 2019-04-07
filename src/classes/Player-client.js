class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.position = {
            x: -20,
            y: -20
        }
    }

    showCursor(ctx) {

        ctx.beginPath();
        ctx.arc(
            this.position.x,
            this.position.y,
            10,
            0,
            2 * Math.PI);
        ctx.fillStyle = '#0F09';
        ctx.fill();

    }

    setCursorPosition(x, y) {
        if(typeof x !== 'undefined' && typeof y !== 'undefined') {
            this.position.x = x;
            this.position.y = y;
        }
    }

}


export default Player;
