<template>
    <MainMenu/>
  <router-view />
      <Footer />
</template>

<script>
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import RestaurantPageList from './views/RestaurantPageList.vue'
import MainMenu from './components/MainMenu.vue' 
import Footer from './components/Footer.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/restaurants', component: RestaurantPageList }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default {
  name: 'App',
  components: {
    MainMenu , Footer
  },
  router
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
  flex-direction: column;
}
</style>