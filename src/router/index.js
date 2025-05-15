import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RestaurantPage from '../views/RestaurantPage.vue'

const routes = [
  { path: '/', component: Home },
  {
    path: '/restaurants/:city', // Параметр city в URL
    name: 'RestaurantPage',
    component: RestaurantPage,
    props: true  // Передаем параметры как пропсы в компонент
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
