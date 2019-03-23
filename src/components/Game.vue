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
    //import Rules from '../classes/Rules.js';
    import Case from '../classes/Case-client.js';
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
                //rules: new Rules(),
                ctx: null,
                socket: io('http://127.0.0.1:3000'),
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
                                /*setTimeout(()=>{

                                    this.rules.setEndGame();
                                    this.cases = this.rules.setNewGame(this.ctx,this.images);
                                },100);*/
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

                if(typeof this.cases[0+':'+0] !== 'undefined') {
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
                } else {
                    console.error('Cases not defined correctly...');
                }
            },
            mouseClientView(data) {
                console.log('data',data);
                console.log('mouseClientView');

                this.ctx.beginPath();
                this.ctx.arc(
                    data.x,
                    data.y,
                    7,
                    0,
                    2 * Math.PI);
                this.ctx.fillStyle = '#999';
                this.ctx.fill();
            },
            loadMap(data) {
                console.log(('loadMap'));
                console.log(data);
                let newData = Object.entries(JSON.parse(data));

                for(let i = 0; i < newData.length; i++) {
                    console.log(newData[i]);
                    let c  = newData[i][1];
                    this.cases[newData[i][0]] =
                        new Case(c.x,c.y,this.ctx,c.mine,this.images);
                }
                for(let x = 0; x < this.casesX; x++) {
                    for(let y = 0; y < this.casesY; y++) {
                        this.cases[x+':'+y].getClosest(this.cases);
                    }
                }

                this.draw = setInterval(()=>{
                    this.drawCanvas();
                },100);
            }
        },
        mounted() {
            this.images.bomb = this.$refs["bombImage"];


            this.images.bomb.onload = ()=>{
                // this.socket = this.socket;
                let c = this.$refs["myCanvas"];
                this.ctx = c.getContext("2d");
                this.socket.on('load the map', this.loadMap);
                this.socket.on('mouse', this.mouseClientView);

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
