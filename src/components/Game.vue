<template>
    <div>
        <canvas ref="myCanvas" width="600" height="600"></canvas>
    </div>
</template>
<script>
    import Case from '../classes/Case.js';
    import Mouse from '../classes/Mouse.js';

    export default {
        name: 'Game',
        data () {
            return {
                draw: null,
            }
        },
        mounted() {
            let c = this.$refs["myCanvas"];
            let ctx = c.getContext("2d");

            let cases = [];

            for(let x = 0; x < 10; x++) {
                for(let y = 0; y < 10; y++) {
                    let mine = Math.floor(Math.random() * Math.floor(10));
                    cases[x+':'+y] = new Case(
                        x,y,
                        ctx,
                        mine > 8
                    )
                }
            }

            this.$refs["myCanvas"].onmousemove = Mouse.mouseOver;

            this.draw = setInterval(()=>{
                for(let x = 0; x < 10; x++) {
                    for(let y = 0; y < 10; y++) {
                        if(Mouse.position.x > 300) {
                            cases[x+':'+y].show(true);
                        } else {
                            cases[x+':'+y].show(false);
                        }
                    }
                }
            },60);


            console.log(cases);

        },
        destroyed() {
            clearInterval(this.draw);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
