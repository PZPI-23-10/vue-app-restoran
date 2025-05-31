<template>
  <div class="review-form">
    <h2>Додати відгук</h2>
    <form @submit.prevent="submit">
      <div class="form-group">
        <label>Оцінка (1-5):</label>
        <input type="number" v-model.number="review.rating" min="1" max="5" required />
      </div>
      <div class="form-group">
        <label>Коментар:</label>
        <textarea v-model="review.text" required></textarea>
      </div>
      <button type="submit">Зберегти</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
const props = defineProps({ modelValue: Object })
const emit = defineEmits(['submit'])
const review = reactive({ ...props.modelValue })

watch(() => props.modelValue, () => Object.assign(review, props.modelValue))

function submit() {
  emit('submit', { ...review })
}
</script>

<style scoped>
.review-form {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
input, textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
