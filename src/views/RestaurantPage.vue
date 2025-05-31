<template>
  <div v-if="restaurant">
    <MainFormRestaurant :restaurant="restaurant" />

    <!-- Карта -->
    <RestaurantLayoutPreview
      :layout="layout"
      :leftElements="leftElements"
      :bottomElements="bottomElements"
    />

    <div class="reviews-wrapper">
      <ReviewForm :modelValue="newReview" @submit="submitReview" />

      <div class="reviews-section">
        <h2>Відгуки</h2>
        <div v-if="reviews.length > 0">
          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <span class="avatar">👤</span>
              <div class="review-info">
                <div class="review-author">{{ review.userId }}</div>
                <div class="review-rating">{{ getStars(review.rating ?? 5) }}</div>
              </div>
            </div>
            <div class="review-text">{{ review.comment }}</div>
          </div>
        </div>
        <div v-else class="no-reviews">Немає відгуків</div>
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
import RestaurantLayoutPreview from '../components/RestaurantLayoutPreview.vue'

const route = useRoute()
const restaurantId = route.params.id
const restaurant = ref(null)
const reviews = ref([])
const layout = ref([])

const newReview = ref({ rating: 5, text: '' })

// элементы мебели:
const leftElements = [
  { id: 1, title: 'Пряма стіна', image: '/images/wall.png' },
  { id: 2, title: 'Окружність', image: '/images/circle.png' },
  { id: 3, title: 'Стіна "Трикутник"', image: '/images/triangle.png' },
  { id: 4, title: 'Двері', image: '/images/door.png' },
  { id: 5, title: 'Вікна', image: '/images/window.png' }
]

const bottomElements = [
  { id: 6, title: 'Місце на двох', image: '/images/tableForTwo.png' },
  { id: 7, title: 'Місце на багатьох', image: '/images/tableForMany.png' },
  { id: 8, title: 'Столи з диваном/кріслом', image: '/images/tableWithSofa.png' },
  { id: 9, title: 'Барна стійка', image: '/images/bar.png' },
  { id: 10, title: 'Сходи', image: '/images/stairs.png' }
]

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

    if (restaurant.value.layout) {
      layout.value = JSON.parse(restaurant.value.layout)
    }
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
    newReview.value = { rating: 5, text: '' }
    await loadReviews()
  } catch (error) {
    console.error('Помилка при додаванні відгуку:', error)
  }
}

function getStars(rating) {
  const full = '★'.repeat(Math.floor(rating))
  const empty = '☆'.repeat(5 - Math.floor(rating))
  return full + empty
}
</script>

<style scoped>
.reviews-wrapper {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.reviews-section {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
}

.review-card {
  border-left: 5px solid #00bcd4;
  padding: 10px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  font-size: 30px;
}

.review-info {
  display: flex;
  flex-direction: column;
}

.review-author {
  font-weight: bold;
  font-size: 16px;
}

.review-rating {
  font-size: 18px;
  color: #ffc107;
}

.review-text {
  font-size: 15px;
  color: #333;
}

.no-reviews {
  font-size: 16px;
  color: #777;
  margin-top: 10px;
  padding: 10px;
  background: #f3f3f3;
  border-radius: 8px;
}

.loading {
  text-align: center;
  font-size: 20px;
  padding: 50px;
}
</style>
