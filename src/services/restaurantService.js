// services/restaurantService.js

import axios from 'axios'

const API_URL = 'https://backend-restoran.onrender.com/api/Restaurant'
const CACHE_KEY = 'cachedRestaurants'
const CACHE_TIME_KEY = 'cachedRestaurantsTime'
const CACHE_DURATION = 5 * 60 * 1000  // 5 минут кэш

// Получить все рестораны (старый метод, без пагинации, оставляем для совместимости)
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

// Получить рестораны с пагинацией (одна страница)
export async function getRestaurantsPaginated(page = 1, pageSize = 10) {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&pageSize=${pageSize}`)
    console.log(`Ресторани з API (сторінка ${page})`)
    return response.data
  } catch (error) {
    console.error('Помилка при завантаженні ресторанів з пагінацією:', error)
    throw error
  }
}

export async function getAllRestaurants(pageSize = 4) {
  let allRestaurants = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await axios.get(`${API_URL}?page=${page}&pageSize=${pageSize}`)
    const data = response.data

    if (!data || data.length === 0) {
      hasMore = false
    } else {
      allRestaurants = allRestaurants.concat(data)
      page++
    }
  }

  return allRestaurants
}
// Получить ресторан по ID
export async function getRestaurantById(id) {
  try {
    const response = await axios.post(`${API_URL}/Get`, { restaurantId: id })
    return response.data
  } catch (error) {
    console.error('Помилка при завантаженні ресторану по ID:', error)
    throw error
  }
}
