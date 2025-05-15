import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/Home.vue'
import RestaurantCreate from '../views/RestaurantCreate.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/create-restaurant',
    name: 'RestaurantCreate',
    component: RestaurantCreate 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router