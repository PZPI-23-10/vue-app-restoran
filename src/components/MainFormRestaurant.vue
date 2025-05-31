<template>
  <div class="restaurant-container">
    <div class="top-section">
      <div class="image-container">
        <img :src="mainImage" alt="Фото ресторану" />
      </div>

      <div class="info-container">
        <h1>{{ restaurant.name }} <span class="stars">{{ getStars(restaurant.rating ?? 4) }}</span></h1>
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

    <div class="dishes-section" v-if="restaurant.dishes.length > 0">
      <div v-for="dish in restaurant.dishes" :key="dish.id" class="dish-card">
        <img :src="dish.photoUrl" alt="Блюдо" />
        <div class="dish-info">
          <div class="dish-title">{{ dish.title }} {{ getStars(dish.rating ?? 5) }}</div>
          <div class="dish-desc">{{ dish.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  restaurant: Object
})

const mainImage = computed(() => {
  if (props.restaurant?.photos?.length > 0) {
    return props.restaurant.photos[0]
  }
  return props.restaurant?.photoUrl ?? ''
})

const cuisineList = computed(() => props.restaurant?.cuisines?.map(c => c.cuisine.name).join(', ') || 'Не вказано')
const tagList = computed(() => props.restaurant?.tags?.map(t => t.tag.name).join(', ') || '—')

function getStars(rating) {
  const full = '★'.repeat(Math.floor(rating))
  const empty = '☆'.repeat(5 - Math.floor(rating))
  return full + empty
}
</script>

<style scoped>
.restaurant-container {
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.top-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.image-container {
  width: 400px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ccc;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: white;
}

.info-container {
  flex: 1;
}

h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.stars {
  font-size: 22px;
  color: #ffc107;
  margin-left: 10px;
}

.description {
  margin-bottom: 20px;
  font-size: 16px;
  max-width: 700px;
}

.meta-block {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

.meta-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.dishes-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.dish-card {
  width: 200px;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}

.dish-card img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
}

.dish-title {
  font-weight: bold;
  margin: 8px 0 5px 0;
}

.dish-desc {
  font-size: 14px;
  color: #666;
}
</style>
