<template>
  <MainMenu @citySelected="selectedCity = $event" />
  <router-view :selectedCity="selectedCity" />
  <Footer />
  <Toast />
</template>

<script>
import MainMenu from './components/MainMenu.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'

export default {
  name: 'App',
  components: { MainMenu, Footer, Toast },
  data() {
    return { selectedCity: 'Київ' }
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

html,
body,
#app {
  height: 100%;
  margin: 0;
  display: flex;
  background-color: #f9f9f9;
  flex-direction: column;
}
</style>
