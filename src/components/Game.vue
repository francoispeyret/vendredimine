<template>
    <div>
        <canvas
                ref="myCanvas"
                width="300" height="300"
                @click="clickOnCanvas"
                @mousemove="mousemoveOnCanvas"
                @contextmenu="rightClickOnCanvas"
        ></canvas>
        <div style="display:none;">
            <img ref="bombImage"
                 src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/155/bomb_1f4a3.png"
                 width="25" height="25">
        </div>
    </div>
</template>
<script>
    import Rules from '../classes/Rules.js';
    import Mouse from '../classes/Mouse.js';
    import io from 'socket.io-client';

    export default {
        name: 'Game',
        data () {
            return {
                draw: null,
                cases: [],
                casesX: 10,
                casesY: 10,
                rules: new Rules(),
                ctx: null,
                socket: io,
                images: {}
            }
        },
        methods: {
            clickOnCanvas() {
                for(let x = 0; x < this.casesX; x++) {
                    for(let y = 0; y < this.casesY; y++) {
                        let current  = this.cases[x+':'+y];
                        if(current.overred === true) {
                            current.setClicked();
                            if(current.mine === true) {
                                this.drawCanvas();
                                setTimeout(()=>{

                                    this.rules.setEndGame();
                                    this.cases = this.rules.setNewGame(this.ctx,this.images);
                                },100);
                            }
                            if(current.closestNumber===0) {
                                current.clickClosest(this.cases,current.x,current.y);
                            }
                        }
                    }
                }
            },
            rightClickOnCanvas(e) {
                e.preventDefault();
                for(let x = 0; x < this.casesX; x++) {
                    for(let y = 0; y < this.casesY; y++) {
                        let current  = this.cases[x+':'+y];
                        if(current.overred === true && !current.clicked) {
                            current.setRightClicked();
                        }
                    }
                }
            },
            mousemoveOnCanvas(e) {
                Mouse.mouseOver(e,this.socket);
            },
            drawCanvas() {
                // fond
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(0,0,600,600);



                for(let x = 0; x < this.casesX; x++) {
                    for(let y = 0; y < this.casesY; y++) {
                        let current  = this.cases[x+':'+y];
                        if(
                            current.x * current.w < Mouse.position.x &&
                            current.x * current.w + current.w >= Mouse.position.x &&
                            current.y * current.w < Mouse.position.y &&
                            current.y * current.w + current.w >= Mouse.position.y
                        )
                            current.overred = true;
                        else
                            current.overred = false;
                        current.show();
                    }
                }
            },
            mouseClientView(data) {
                console.log('data',data);
                console.log('mouseClientView');
                this.ctx.beginPath();
                this.ctx.rect(data.x,data.y,20,20);
                this.ctx.fillStyle = '#000';
                this.ctx.fill();
            }
        },
        mounted() {
            this.images.bomb = this.$refs["bombImage"];


            this.images.bomb.onload = ()=>{
                this.socket = this.socket('http://192.168.212.66:3000');
                this.socket.on('mouse', this.mouseClientView);

                let c = this.$refs["myCanvas"];
                this.ctx = c.getContext("2d");

                this.cases = this.rules.setNewGame(this.ctx,this.images);

                this.draw = setInterval(()=>{
                    this.drawCanvas();
                },100);
            };


        },
        destroyed() {
            clearInterval(this.draw);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
