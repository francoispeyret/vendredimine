class Case {
    constructor(x, y, ctx, mine,images) {
        this.x = x;
        this.y = y;
        this.w = 29;
        this.ctx = ctx;
        this.mine = mine;
        this.overred = false;
        this.clicked = false;
        this.closestNumber = 0;
        this.safeMode = false;
        this.images = images;
    }

    show() {
        this.getStrokeCase();
        this.getCaseDisplay();
        if(this.clicked) {
            if(!this.mine) {

                this.getNumberDisplay();
            } else {
                this.getMineDisplay();
            }
        }
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

    getMineDisplay() {
        this.ctx.drawImage(this.images.bomb,
            this.x * this.w+3,
            this.y * this.w+3,
            22,22);
    }

    getStrokeCase() {
        this.ctx.beginPath();
        this.ctx.lineWidth=1;
        this.ctx.strokeStyle='#ccc';
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
        } else {
            if(this.safeMode) {
                this.ctx.fillStyle = "tomato";
            } else {
                if(this.overred)
                    this.ctx.fillStyle = "#eee";
                else
                    this.ctx.fillStyle = "white";
            }
        }
    }

    getNumberDisplay() {
        if(!this.mine /*&& this.clicked*/) {
            if(this.closestNumber === 0)
                this.ctx.fillStyle = "#f0f0f0";
            else if(this.closestNumber === 1)
                this.ctx.fillStyle = "#d0d0d0";
            else if(this.closestNumber === 2)
                this.ctx.fillStyle = "#a0a0a0";
            else if(this.closestNumber === 3)
                this.ctx.fillStyle = "#909090";
            else if(this.closestNumber === 4)
                this.ctx.fillStyle = "#996666";
            else if(this.closestNumber === 5)
                this.ctx.fillStyle = "tomato";
            else if(this.closestNumber > 5)
                this.ctx.fillStyle = "red";
            this.ctx.textAlign = "center";
            this.ctx.font = "18px Monospace";
            this.ctx.fillText(this.closestNumber, this.x*this.w+this.w/2, this.y*this.w+this.w/1.5);
        }
    }

    setClicked() {
        this.clicked = true;
    }

    setRightClicked() {
        this.safeMode = !this.safeMode;
    }

    getClosest(cases) {
        if(this.mine) {
            this.closestNumber = '*';
        } else {
            if(this.checkCaseMine(cases,-1,-1))
                this.closestNumber++;
            if(this.checkCaseMine(cases,0,-1))
                this.closestNumber++;
            if(this.checkCaseMine(cases,1,-1))
                this.closestNumber++;
            if(this.checkCaseMine(cases,-1,0))
                this.closestNumber++;
            if(this.checkCaseMine(cases,1,0))
                this.closestNumber++;
            if(this.checkCaseMine(cases,-1,1))
                this.closestNumber++;
            if(this.checkCaseMine(cases,0,1))
                this.closestNumber++;
            if(this.checkCaseMine(cases,1,1))
                this.closestNumber++;
        }
    }

    checkCaseMine(cases,x,y) {
        if(typeof cases[(this.x+x)+':'+(this.y+y)] !== "undefined") {
            if(cases[(this.x+x)+':'+(this.y+y)].mine === true) {
                return true;
            }
        }
        return false;
    }

    clickClosest(cases,refx,refy) {
        if(this.checkCaseZero(cases,refx,refy,-1,-1))
            this.setClickedCase(cases,refx,refy,-1,-1);
        if(this.checkCaseZero(cases,refx,refy,0,-1))
            this.setClickedCase(cases,refx,refy,0,-1);
        if(this.checkCaseZero(cases,refx,refy,1,-1))
            this.setClickedCase(cases,refx,refy,1,-1);
        if(this.checkCaseZero(cases,refx,refy,-1,0))
            this.setClickedCase(cases,refx,refy,-1,0);
        if(this.checkCaseZero(cases,refx,refy,1,0))
            this.setClickedCase(cases,refx,refy,1,0);
        if(this.checkCaseZero(cases,refx,refy,-1,1))
            this.setClickedCase(cases,refx,refy,-1,1);
        if(this.checkCaseZero(cases,refx,refy,0,1))
            this.setClickedCase(cases,refx,refy,0,1);
        if(this.checkCaseZero(cases,refx,refy,1,1))
            this.setClickedCase(cases,refx,refy,1,1);
    }

    checkCaseZero(cases,refx,refy,x,y) {
        if(typeof cases[(refx+x)+':'+(refy+y)] !== "undefined") {
            let current = cases[(refx+x)+':'+(refy+y)];
            if(parseInt(current.closestNumber) >= 0 && current.clicked===false) {
                // @todo : recursive ?
                // if(parseInt(current.closestNumber)===0 ) {
                //     this.clickClosest(cases,current.x,current.y);
                // }
                return true;
            }
        }
        return false;
    }
    setClickedCase(cases,refx,refy,x,y) {
        if(typeof cases[(refx+x)+':'+(refy+y)] !== "undefined") {
            if(cases[(refx+x)+':'+(refy+y)].clicked === false) {
                cases[(refx+x)+':'+(refy+y)].clicked = true;
            }
        }
    }
}

export default Case;
