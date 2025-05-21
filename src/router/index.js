import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RestaurantPageList from '../views/RestaurantPageList.vue'
import RestaurantCreate from '../views/RestaurantCreate.vue'
import RestaurantPage from '../views/RestaurantPage.vue'
const routes = [
  { path: '/', component: Home },
  {
    path: '/restaurants/:city', // Параметр city в URL
    name: 'RestaurantPageList',
    component: RestaurantPageList,
    props: true  
  },
  {
    path: '/create-restaurant',
    name: 'RestaurantCreate',
    component: RestaurantCreate 
  },
  {
    path: '/restaurant/:id',
    name: 'RestaurantPage',
    component: RestaurantPage,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
