// services/restaurantService.js

import axios from 'axios'

const API_URL = 'https://backend-restoran.onrender.com/api/Restaurant'
const CACHE_KEY = 'cachedRestaurants'
const CACHE_TIME_KEY = 'cachedRestaurantsTime'
const CACHE_DURATION = 5 * 60 * 1000  // 5 минут кэш

// Получить все рестораны
export async function getRestaurants(useCache = true) {
  const now = Date.now()

  if (useCache) {
    const cached = localStorage.getItem(CACHE_KEY)
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY)

    if (cached && cachedTime && now - cachedTime < CACHE_DURATION) {
      console.log('Ресторани з кешу')
      return JSON.parse(cached)
    }
  }

  try {
    const response = await axios.get(API_URL)
    localStorage.setItem(CACHE_KEY, JSON.stringify(response.data))
    localStorage.setItem(CACHE_TIME_KEY, now.toString())
    console.log('Ресторани з API')
    return response.data
  } catch (error) {
    console.error('Помилка при завантаженні ресторанів:', error)
    throw error
  }
}

export async function getRestaurantById(id) {
  try {
    const response = await axios.post(`${API_URL}/Get`, { restaurantId: id })
    return response.data
  } catch (error) {
    console.error('Помилка при завантаженні ресторану по ID:', error)
    throw error
  }
}
