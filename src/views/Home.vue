<template>
  <div class="home-page">
    <h2 class="cities-title">Популярні ресторани</h2>

    <div class="restaurant-grid">
      <div
        class="restaurant-card"
        v-for="restaurant in displayedRestaurants"
        :key="restaurant.id"
        @click="goToRestaurant(restaurant.id)"
      >
        <img :src="getPhotoUrl(restaurant)" alt="Фото ресторану" class="restaurant-img" />
        <div class="restaurant-card-content">
          <div class="header-row">
            <h3>{{ restaurant.name }}</h3>
            <div class="rating">{{ getRatingDisplay(restaurant) }}</div>
          </div>
          <p>{{ restaurant.city }}, {{ restaurant.street }}</p>
          <p>{{ restaurant.cuisines?.[0]?.cuisine?.name || 'Без кухні' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllRestaurants } from '../services/restaurantService'

const router = useRouter()
const restaurants = ref([])

onMounted(async () => {
  try {
    restaurants.value = await getAllRestaurants(4)  // pageSize можно регулировать
  } catch (error) {
    console.error('Помилка при завантаженні ресторанів:', error)
  }
})

function getAverageRating(restaurant) {
  if (!restaurant.reviews || restaurant.reviews.length === 0) {
    return null
  }
  const validReviews = restaurant.reviews.filter(r => r.rating !== null && r.rating !== undefined)
  if (validReviews.length === 0) {
    return null
  }
  const sum = validReviews.reduce((total, review) => total + review.rating, 0)
  return (sum / validReviews.length).toFixed(1)
}

function getRatingDisplay(restaurant) {
  const avg = getAverageRating(restaurant)
  return avg !== null ? `⭐ ${avg}/5` : '☆ 0/5'
}

const displayedRestaurants = computed(() => {
  return [...restaurants.value]
    .sort((a, b) => {
      const ratingA = parseFloat(getAverageRating(a)) || 0
      const ratingB = parseFloat(getAverageRating(b)) || 0
      return ratingB - ratingA
    })
    .slice(0, 4)
})

function goToRestaurant(id) {
  router.push(`/restaurant/${id}`)
}

function getPhotoUrl(restaurant) {
  return restaurant.photoUrl || '/images/default_restaurant.jpg'
}
</script>


  <style scoped>
  .home-page {
    padding: 60px 40px;
    font-family: 'Poppins', sans-serif;
  }
  .filters-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }
  .filter-group {
    display: flex;
    border: 1px solid #333;
    border-radius: 8px;
    overflow: visible;
    position: relative;
  }
  .filter-search {
    display: flex;
    align-items: center;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 8px 12px;
    gap: 8px;
    flex-shrink: 0;
    background-color: white;
  }
  .filter-search input {
    border: none;
    outline: none;
    font-size: 14px;
    background: none;
    width: 160px;
  }
  .cities-title {
    font-size: 24px;
    margin: 40px 0 20px;
    border-bottom: 3px solid #00BCD4;
    display: inline-block;
    padding-bottom: 10px;
  }
  .restaurant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 40px;
    margin-top: 20px;
    justify-content: center;
  }
  .restaurant-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }
  .restaurant-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  }
  .restaurant-img {
    width: 100%;
    height: 200px;
    object-fit: contain;
    background-color: #f9f9f9;
  }
  .restaurant-card-content {
    padding: 20px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .restaurant-card h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #222;
  }
  .restaurant-card p {
    font-size: 14px;
    color: #555;
    margin: 0;
  }
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .rating {
    font-size: 16px;
    color: #f39c12;
    font-weight: 500;
    white-space: nowrap;
  }
  </style>
