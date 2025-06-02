<template>
  <div v-if="restaurant" class="restaurant-page">
    <!-- Верхний блок: MainFormRestaurant -->
    <MainFormRestaurant :restaurant="restaurant" />

    <!-- Нижний блок -->
    <div class="bottom-section">
      <!-- Левая колонка: Отзывы -->
      <div class="left-panel">
        <h2>Додати відгук</h2>
        <ReviewForm @submit="submitReview" />

        <h2 style="margin-top: 30px;">Відгуки</h2>
        <ReviewList :reviews="reviews" />
      </div>

      <!-- Правая колонка: Блюда -->
      <div class="right-panel">
        <h2>Меню ресторану</h2>
        <DishesPrint :dishes="restaurant.dishes" />
      </div>
    </div>
  </div>

  <div v-else class="loading">Завантаження ресторану...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

import MainFormRestaurant from '../components/MainFormRestaurant.vue'
import ReviewForm from '../components/ReviewForm.vue'
import ReviewList from '../components/ReviewList.vue'
import DishesPrint from '../components/DishesPrint.vue'

const route = useRoute()
const restaurantId = route.params.id
const restaurant = ref(null)
const reviews = ref([])

onMounted(async () => {
  await loadRestaurant()
  await loadReviews()
})

async function loadRestaurant() {
  try {
    const response = await axios.post(
      'https://backend-restoran.onrender.com/api/Restaurant/Get',
      { restaurantId },
      { headers: { 'Content-Type': 'application/json' } }
    )
    restaurant.value = response.data ?? {}
  } catch (error) {
    console.error('Помилка при завантаженні ресторану:', error)
  }
}

async function loadReviews() {
  try {
    const response = await axios.get(
      `https://backend-restoran.onrender.com/api/Reviews/restaurant/${restaurantId}`
    )
    reviews.value = response.data ?? []
  } catch (error) {
    console.error('Помилка при завантаженні відгуків:', error)
  }
}

async function submitReview(reviewData) {
  try {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Спочатку увійдіть у свій акаунт!')
      return
    }

    const payload = {
      rating: reviewData.rating,
      comment: reviewData.text,
      restaurantId: restaurantId,
      userId: userId
    }

    await axios.post('https://backend-restoran.onrender.com/api/Reviews', payload)
    await loadReviews()
  } catch (error) {
    console.error('Помилка при додаванні відгуку:', error)
  }
}
</script>

<style scoped>
.restaurant-page {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
}

.bottom-section {
  display: flex;
  gap: 40px;
}

.left-panel {
  flex: 1;
  max-width: 400px;  /* уменьшаем ограничение левой части */
}

.right-panel {
  flex: 2; /* даем приоритет правой части */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: none; /* снимаем ограничение */
}

.loading {
  text-align: center;
  font-size: 20px;
  padding: 50px;
}
</style>
