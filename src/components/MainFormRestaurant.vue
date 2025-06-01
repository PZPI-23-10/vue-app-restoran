<template>
  <div class="restaurant-container">
    <!-- Верхний блок -->
    <div class="top-section">
      <div class="main-image">
        <div class="slider">
          <div class="slides" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div class="slide" v-for="(photo, index) in allPhotos" :key="index">
              <img :src="photo" alt="Фото ресторану" />
            </div>
          </div>
          <div class="dots">
            <span v-for="(photo, index) in allPhotos"
                  :key="index"
                  :class="{ active: index === currentSlide }"
                  @click="goToSlide(index)">
            </span>
          </div>
        </div>
      </div>

      <div class="info-container">
        <div class="header-line">
          <div class="title-rating">
            <h1>{{ restaurant.name }}</h1>
            <span class="stars">{{ getStars(averageRating) }}</span>
          </div>
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

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  restaurant: {
    type: Object,
    required: true
  }
})

const allPhotos = computed(() => {
  if (props.restaurant?.photos?.length > 0) {
    return props.restaurant.photos.map(photo => photo.url)
  }
  return ['/images/default_restaurant.jpg']
})

const currentSlide = ref(0)
function goToSlide(index) {
  currentSlide.value = index
}

onMounted(() => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % allPhotos.value.length
  }, 5000)
})

const cuisineList = computed(() =>
  props.restaurant?.cuisines?.map(c => c.cuisine.name).join(', ') || 'Не вказано'
)

const tagList = computed(() =>
  props.restaurant?.tags?.map(t => t.tag.name).join(', ') || '—'
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
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.top-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.main-image {
  width: 400px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ccc;
  position: relative;
}

.slider {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.slides {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.slide {
  min-width: 100%;
  height: 100%;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.dots span {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 4px;
  background: #ddd;
  border-radius: 50%;
  cursor: pointer;
}

.dots span.active {
  background: #333;
}

.info-container {
  flex: 1;
}

.header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.stars {
  font-size: 22px;
  color: #ffc107;
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

/* Страви */
.dishes-section {
  margin-top: 40px;
}

.dishes-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
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
