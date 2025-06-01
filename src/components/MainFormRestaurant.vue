<template>
  <div class="restaurant-container">
    <div class="top-section">
      <div class="main-image">
        <div class="slider">
          <div class="slides" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div class="slide" v-for="(photo, index) in allPhotos" :key="index">
              <img :src="photo" alt="Фото ресторану" />
            </div>
          </div>
          <div class="dots">
            <span
              v-for="(photo, index) in allPhotos"
              :key="index"
              :class="{ active: index === currentSlide }"
              @click="goToSlide(index)"
            ></span>
          </div>
        </div>
      </div>

      <div class="info-container">
        <h1>
          {{ restaurant.name }}
          <span class="stars">{{ getStars(averageRating) }}</span>
          <span class="review-count">({{ restaurant.reviews?.length ?? 0 }})</span>
        </h1>

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

    <div class="dishes-section" v-if="restaurant.dishes?.length > 0">
      <div v-for="dish in restaurant.dishes" :key="dish.id" class="dish-card">
        <img :src="dish.photoUrl" alt="Блюдо" />
        <div class="dish-info">
          <div class="dish-title">
            {{ dish.title }} {{ getStars(dish.rating ?? 5) }}
          </div>
          <div class="dish-desc">{{ dish.description }}</div>
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

const currentSlide = ref(0)

function goToSlide(index) {
  currentSlide.value = index
}

// Автоматическое переключение слайдов
onMounted(() => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % allPhotos.value.length
  }, 3000)
})
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

h1 {
  font-size: 32px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  font-size: 22px;
  color: #ffc107;
}

.review-count {
  font-size: 16px;
  color: #666;
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
