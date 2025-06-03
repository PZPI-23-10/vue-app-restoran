<template>
  <div class="restaurant-list">
    <!-- Прелоадер -->
    <div v-if="!restaurants || restaurants.length === 0" class="loading">
      Немає ресторанів у межах видимості карти...
    </div>

    <!-- Список ресторанів -->
    <div
      v-else
      v-for="restaurant in restaurants"
      :key="restaurant.id"
      class="restaurant-card"
      @click="goToRestaurant(restaurant.id)"
    >
      <div class="header-row">
        <h3 class="restaurant-name">{{ restaurant.name }}</h3>
        <div class="address">{{ restaurant.city }} вул.{{ restaurant.street }}</div>
      </div>

      <div class="rating-row">
        <span class="stars">{{ getStars(restaurant) }}</span>
        <span class="rating-text">{{ getRatingText(restaurant) }}</span>
        <span class="review-count">({{ restaurant.reviews?.length || 0 }})</span>
      </div>

      <div class="tags">
        <span v-for="tag in restaurant.tags" :key="tag.id" class="tag">{{ tag.tag?.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  }
})

const router = useRouter()

function goToRestaurant(id) {
  if (id) {
    router.push(`/restaurant/${id}`)
  } else {

  }
}

function getAverageRating(restaurant) {
  if (!restaurant.reviews || restaurant.reviews.length === 0) return 0
  const total = restaurant.reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0)
  return total / restaurant.reviews.length
}

function getStars(restaurant) {
  const avg = Math.round(getAverageRating(restaurant))
  const full = '★'.repeat(avg)
  const empty = '☆'.repeat(5 - avg)
  return full + empty
}

function getRatingText(restaurant) {
  const avg = getAverageRating(restaurant)
  if (avg >= 4.5) return 'Відмінно'
  if (avg >= 3.5) return 'Добре'
  if (avg >= 2.5) return 'Задовільно'
  if (avg >= 1.5) return 'Погано'
  return 'Дуже погано'
}
</script>

<style scoped>
.restaurant-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.restaurant-card {
  border: 1px solid #ccc;
  padding: 14px;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.restaurant-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.restaurant-name {
  font-size: 20px;
  font-weight: bold;
}

.address {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.stars {
  color: gold;
  font-size: 18px;
}

.rating-text {
  font-weight: 500;
}

.review-count {
  color: #666;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 2px 10px;
  border: 1px solid #d33;
  border-radius: 12px;
  font-size: 13px;
  color: #d33;
}

.loading {
  padding: 20px;
  font-size: 18px;
  text-align: center;
  color: #888;
}
</style>
