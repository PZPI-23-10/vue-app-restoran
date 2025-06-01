import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RestaurantPageList from '../views/RestaurantPageList.vue'
import RestaurantCreate from '../views/RestaurantCreate.vue'
import RestaurantPage from '../views/RestaurantPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import GoogleAuthCallback from '../components/GoogleAuthCallback.vue'

import ProfileUser from '../components/ProfileUser.vue'
import ProfileFavoriteDishes from '../components/ProfileFavoriteDishes.vue'
import ProfileReservations from '../components/ProfileReservations.vue'
import ProfileRestaurants from '../components/ProfileRestaurants.vue' 

const routes = [
  {
    path: '/profile',
    component: ProfilePage,
    beforeEnter: (to, from, next) => {
      const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true'
      if (isLoggedIn) next()
      else {
        alert('Будь ласка, увійдіть в акаунт')
        next('/')
      }
    },
    children: [
      { path: '', redirect: 'info' },
      { path: 'info', component: ProfileUser },
      { path: 'favorites', component: ProfileFavoriteDishes },
      { path: 'reservations', component: ProfileReservations },
      { path: 'restaurants', component: ProfileRestaurants}
    ]
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
