class Case {
    constructor(x, y, ctx, mine) {
        this.x = x;
        this.y = y;
        this.w = 59;
        this.ctx = ctx;
        this.mine = mine;
        this.overred = false;
        this.clicked = false;
        this.closestNumber = 0;

    }

    show() {
        this.getStrokeCase();
        this.getCaseDisplay();
        this.getNumberDisplay();
    }

    getCaseDisplay() {
        this.getCaseColor();
        this.ctx.beginPath();
        this.ctx.arc(
            this.x * this.w + this.w / 2,
            this.y * this.w + this.w / 2,
            this.w / 3,
            0,
            2 * Math.PI);
        this.ctx.fill();
    }

    getStrokeCase() {
        this.ctx.beginPath();
        this.ctx.rect(
            this.x * this.w + 1,
            this.y * this.w + 1,
            this.w,
            this.w
        );
        this.ctx.stroke();
    }

    getCaseColor() {
        if(this.clicked) {
            this.ctx.fillStyle = "#fff";
            // this.ctx.fillStyle = "blue";
        } else {
            // if(this.overred && this.mine)
            //     this.ctx.fillStyle = "red";
            // else if(!this.overred && this.mine)
            //         this.ctx.fillStyle = "tomato";
            if(this.overred)
                this.ctx.fillStyle = "#eee";
            else
                this.ctx.fillStyle = "white";
        }
    }

    getNumberDisplay() {
        if(!this.mine && this.clicked) {
            this.ctx.fillStyle = "#aaa";
            this.ctx.textAlign = "center";
            this.ctx.font = "28px Mono";
            this.ctx.fillText(this.closestNumber, this.x*this.w+this.w/2, this.y*this.w+this.w/1.5);
        }
    }

    setClicked() {
        this.clicked = true;
    }

    getClosest(cases) {
        if(this.mine) {
            this.closestNumber = '*';
        } else {
            if(this.checkCase(cases,-1,-1))
                this.closestNumber++;
            if(this.checkCase(cases,0,-1))
                this.closestNumber++;
            if(this.checkCase(cases,1,-1))
                this.closestNumber++;
            if(this.checkCase(cases,-1,0))
                this.closestNumber++;
            if(this.checkCase(cases,1,0))
                this.closestNumber++;
            if(this.checkCase(cases,-1,1))
                this.closestNumber++;
            if(this.checkCase(cases,0,1))
                this.closestNumber++;
            if(this.checkCase(cases,1,1))
                this.closestNumber++;
        }
    }

    checkCase(cases,x,y) {
        if(typeof cases[(this.x+x)+':'+(this.y+y)] !== "undefined") {
            if(cases[(this.x+x)+':'+(this.y+y)].mine === true) {
                return true;
            }
        }
        return false;
    }
}

export default Case;
