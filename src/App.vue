<template>
  <div id="app">
    <MainMenu />
    <router-view />
  </div>
</template>

<script>
import MainMenu from './components/MainMenu.vue'

export default {
  name: 'App',
  components: {
    MainMenu
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #fff;
  color: #000;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>