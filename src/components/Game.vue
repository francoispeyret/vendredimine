<template>
    <div>
        <canvas
                ref="myCanvas"
                width="600" height="600"
                @click="clickOnCanvas"
                @mousemove="mousemoveOnCanvas"
                @contextmenu="rightClickOnCanvas"
        ></canvas>
        <div class="" style="width:600px;">
            <button type="button" name="button" @click="serverGetNewGame">New game</button>

            <div style="float:right;">
            <input type="text" name="playerName" v-model="playerName" ref="playerName" placeholder="My pseudo">
            <button type="button" name="button" @click="serverSetMyName">Save</button>
            </div>
        </div>
        <div class="gameover" ref="gameOver" v-if="gameOverDisplay">

            <button type="button" name="button" @click="serverGetNewGame">New game</button>
            <div style="width:100%;height:0;padding-bottom:54%;position:relative;">
                <iframe src="https://giphy.com/embed/4TbPO7k1V4Zdm" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
            </div>
        </div>
        <div style="display:none;">
            <img ref="bombImage"
                 src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/155/bomb_1f4a3.png"
                 width="25" height="25">
        </div>
    </div>
</template>
<script>
    import Case from '../classes/Case-client.js';
    import Mouse from '../classes/Mouse.js';
    import Player from '../classes/Player-client.js';
    import io from 'socket.io-client';

    export default {
        name: 'Game',
        data () {
            return {
                draw: null,
                playerName: '',
                cases: [],
                casesX: 12,
                casesY: 12,
                gameOverDisplay: false,
                //rules: new Rules(),
                ctx: null,
                socket: io('http://vendredimine.francoispeyret.fr:3000'),
                images: {},
                players: [
                    new Player('1','Michel')
                ]
            }
        },
        methods: {
            gameOver() {
                setTimeout(()=>{
                this.gameOverDisplay = true;
                }, 500);
            },
            clickOnCanvas() {
                this.socket.emit('click',Mouse);
                console.log('click');
            },
            rightClickOnCanvas(e) {
                e.preventDefault();
                this.socket.emit('rightClick',Mouse);
                console.log('rightClick');
            },
            mousemoveOnCanvas(e) {
                Mouse.mouseOver(e,this.socket);
            },
            drawCanvas() {
                // fond
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(0,0,750,750);

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

                for(let p = 0; p < this.players.length; p++) {
                    this.players[p].showCursor(this.ctx);
                }
            },
            mouseClientView(data) {

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

                this.gameOverDisplay = false;
                console.log('loadMap');
                let newData = Object.entries(JSON.parse(data));



                for(let i = 0; i < newData.length; i++) {
                    let c  = newData[i][1];
                    this.cases[newData[i][0]] =
                        new Case(c.x,c.y,this.ctx,c.mine,c.safeMode,this.images,c.clicked);
                }
                for(let x = 0; x < this.casesX; x++) {
                    for(let y = 0; y < this.casesY; y++) {
                        this.cases[x+':'+y].getClosest(this.cases);
                    }
                }

                this.draw = setInterval(()=>{
                    this.drawCanvas();
                },100);
            },
            serverGetNewGame() {
                console.log('serverGetNewGame');
                this.socket.emit('getNewGame');
                this.gameOverDisplay = false;
            },
            serverSetMyName() {
                console.log('serverSetMyName',this.playerName);
                this.socket.emit('setMyName',this.playerName);

            },
            playersShow(data) {
                let newData = Object.entries(JSON.parse(data));
                console.log(newData);
                let newDataClass = [];
                for(let p = 0; p < newData.length; p++) {
                    newDataClass[newData[p].id] = new Player(newData[p].id,newData[p].name)
                }
                this.players = newData;
            },
        },
        mounted() {
            this.images.bomb = this.$refs["bombImage"];


            this.images.bomb.onload = ()=>{
                // this.socket = this.socket;
                let c = this.$refs["myCanvas"];
                this.ctx = c.getContext("2d");
                this.socket.on('load the map', this.loadMap);
                this.socket.on('mouse', this.mouseClientView);
                this.socket.on('gameover', this.gameOver);
                this.socket.on('players', this.playersShow);

            };


        },
        destroyed() {
            clearInterval(this.draw);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .gameover {
        position: fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        z-index:90;
        background: #000;
    }
    .gameover iframe {
        height: 100vh;
        object-fit: cover;
        pointer-events: none;
    }
    .gameover button {
        position: absolute;
        top: calc(50% - 40px);
        left: calc(50% - 120px);
        height: 80px;
        width: 240px;
        z-index: 100;
    }
    input,
    button {
        color: #fff;
        border: 0;
        background: #333;
        text-transform: uppercase;
        font-size: 32px;
    }
    button:hover {
        background: #000;
        cursor: pointer;
    }
</style>
