<template>
    <div>
        <canvas ref="myCanvas" width="600" height="600"></canvas>
    </div>
</template>
<script>
    import Case from '../classes/Case.js';

    export default {
        name: 'Game',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        mounted() {
            let c = this.$refs["myCanvas"];
            let ctx = c.getContext("2d");

            let cases = [];

            for(let y = 0; y < 10; y++) {
                for(let x = 0; x < 10; x++) {
                    let mine = Math.floor(Math.random() * Math.floor(10));
                    cases.push(
                        new Case(
                            x,y,
                            ctx,
                            mine > 8
                        )
                    );
                }
            }
            for(let i = 0; i < cases.length; i++) {
                cases[i].show();
            }

            console.log(cases);

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
