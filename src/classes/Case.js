class Case {
    constructor(x, y, ctx, mine) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.ctx = ctx;
        this.mine = mine;
    }

    show() {
        this.ctx.beginPath();
        this.ctx.rect(
            this.x * this.w + 1,
            this.y * this.w + 1,
            this.w,
            this.w
        );
        this.ctx.stroke();

        if (this.mine) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "tomato";
            this.ctx.arc(
                this.x * this.w + this.w / 2,
                this.y * this.w + this.w / 2,
                this.w / 3,
                0,
                2 * Math.PI);
            this.ctx.fill();
        }

    }
}

export default Case;
