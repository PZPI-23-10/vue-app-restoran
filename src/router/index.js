import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RestaurantPageList from '../views/RestaurantPageList.vue'
import RestaurantCreate from '../views/RestaurantCreate.vue'
import RestaurantPage from '../views/RestaurantPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import GoogleAuthCallback from '../components/GoogleAuthCallback.vue'

const routes = [
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
    beforeEnter: (to, from, next) => {
      const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true'
      if (isLoggedIn) {
        next()
      } else {
        alert('Будь ласка, увійдіть в акаунт')
        next('/') // или открыть модальное окно
      }
    }
  },

  { path: '/', component: Home },
 {
    path: '/restaurants/:city?',
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
   {
    path: '/google-auth-callback',
    component: GoogleAuthCallback
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
