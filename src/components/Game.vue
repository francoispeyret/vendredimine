<template>
    <div>
        <canvas ref="myCanvas" width="600" height="600" @click="clickOnCanvas"></canvas>
    </div>
</template>
<script>
    import Rules from '../classes/Rules.js';
    import Case from '../classes/Case.js';
    import Mouse from '../classes/Mouse.js';

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
                                this.rules.setEndGame();
                                this.cases = this.rules.setNewGame(this.ctx);
                            }
                            if(current.closestNumber===0) {
                                current.clickClosest(this.cases,current.x,current.y);
                            }
                        }
                    }
                }
            }
        },
        mounted() {
            let c = this.$refs["myCanvas"];
            this.ctx = c.getContext("2d");

            this.cases = this.rules.setNewGame(this.ctx);

            this.$refs["myCanvas"].onmousemove = Mouse.mouseOver;

            this.draw = setInterval(()=>{
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
            },100);

        },
        destroyed() {
            clearInterval(this.draw);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
