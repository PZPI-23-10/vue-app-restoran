<template>
  <div class="restaurant-container">
    <div class="top-section">
      <div class="main-image">
        <img :src="mainPhoto" alt="Фото ресторану" />
      </div>

      <div class="info-container">
        <div class="header-line">
          <div class="title-rating">
            <h1>{{ restaurant.name }}</h1>
            <span class="stars">{{ getStars(averageRating) }}</span>
          </div>

          <!-- Кнопка для открытия модалки -->
          <button class="grid-button" @click="toggleGrid">
            <span class="material-icons">grid_view</span>
          </button>
        </div>

        <p class="description">{{ restaurant.description }}</p>

        <div class="meta-block">
          <div class="left-meta">
            <div class="meta-title">Кухня</div>
            <div>{{ cuisineList }}</div>
          </div>

          <div class="right-meta">
            <div class="meta-title">Теги</div>
            <div>{{ tagList }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для отображения плана -->
    <div class="modal-overlay" v-if="showLayoutPreview" @click.self="closeLayoutPreview">
      <div class="modal-content">
        <button class="close-button" @click="closeLayoutPreview">×</button>
        <RestaurantLayoutPreview :layout="restaurant.layout" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import RestaurantLayoutPreview from './RestaurantLayoutPreview.vue'

const props = defineProps({
  restaurant: {
    type: Object,
    required: true
  }
})

const showLayoutPreview = ref(false)

function toggleGrid() {
  showLayoutPreview.value = true
}

function closeLayoutPreview() {
  showLayoutPreview.value = false
}

const mainPhoto = computed(() => {
  if (props.restaurant?.gallery?.length > 0) {
    return props.restaurant.gallery[0]
  }
  return '/images/default_restaurant.jpg'
})

const cuisineList = computed(() =>
  props.restaurant?.cuisine?.map(c => c.name).join(', ') || 'Не вказано'
)

const tagList = computed(() =>
  props.restaurant?.tags?.map(t => t.name).join(', ') || '—'
)

const averageRating = computed(() => {
  const reviews = props.restaurant?.reviews ?? []
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0)
  return total / reviews.length
})

function getStars(rating) {
  const rounded = Math.round(rating)
  const full = '★'.repeat(rounded)
  const empty = '☆'.repeat(5 - rounded)
  return full + empty
}
</script>

<style scoped>
.restaurant-container {
  padding: 30px;
  font-family: 'Arial', sans-serif;
}

.top-section {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.main-image {
  width: 500px;
  height: 350px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ccc;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-rating {
  display: flex;
  align-items: center;
  gap: 15px;
}

h1 {
  font-size: 32px;
  margin: 0;
}

.stars {
  font-size: 26px;
  color: #ffc107;
}

.grid-button {
  background-color: #00bcd4;
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.grid-button:hover {
  background-color: #0097a7;
}

.material-icons {
  font-size: 24px;
  color: white;
}

.description {
  font-size: 16px;
  line-height: 1.5;
  max-width: 600px;
}

.meta-block {
  display: flex;
  gap: 100px;
}

.left-meta, .right-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-title {
  font-weight: bold;
  font-size: 18px;
}

/* Модалка */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 800px;
  max-width: 90%;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 26px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
