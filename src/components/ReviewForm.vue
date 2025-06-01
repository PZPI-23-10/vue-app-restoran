<template>
  <form @submit.prevent="handleSubmit" class="review-form">
    <div class="form-group">
      <label>Оцінка:</label>
      <div class="stars-select">
        <span v-for="star in 5"
              :key="star"
              class="star"
              :class="{ active: star <= (hoverRating || form.rating) }"
              @click="form.rating = star"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = 0">★</span>
      </div>
    </div>

    <div class="form-group">
      <label>Коментар:</label>
      <textarea v-model="form.text" required></textarea>
    </div>

    <button type="submit">Зберегти</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['submit'])
const form = ref({ rating: 1, text: '' })
const hoverRating = ref(0)

function handleSubmit() {
  emit('submit', form.value)
  form.value = { rating: 1, text: '' }
}
</script>

<style scoped>
.review-form {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 10px 20px;
  background-color: #00bcd4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.stars-select {
  display: flex;
  gap: 8px;
  font-size: 30px;
  cursor: pointer;
}

.star {
  color: #ccc;
}

.star.active {
  color: #ffc107;
}
</style>
