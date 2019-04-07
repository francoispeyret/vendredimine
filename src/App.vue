<template>
  <div id="app">
    <Game/>
  </div>
</template>

<script>
import Game from './components/Game';

export default {
  name: 'App',
  components: {
    Game
  }
}
</script>


<style>
  body {
    background: #222;
  }
</style>