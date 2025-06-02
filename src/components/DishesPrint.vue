<template>
  <div class="dishes-list">
    <div v-if="dishes.length > 0" class="grid">
      <div v-for="dish in dishes" :key="dish.id" class="dish-card">
        <div class="dish-info">
          <div class="dish-title">{{ dish.title }}</div>
          <div class="dish-desc">{{ dish.ingredients }}</div>
          <div class="dish-meta">{{ dish.weight }} г • {{ dish.price }} грн</div>
        </div>
        <div class="dish-image-wrapper">
          <img :src="dish.photoUrl" alt="Фото блюда" />
        </div>
      </div>
    </div>
    <div v-else>Меню порожнє</div>
  </div>
</template>

<script setup>
const props = defineProps({
  dishes: Array
})
</script>

<style scoped>
.dishes-list {
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
}

.dish-card {
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
  height: 150px;
  transition: transform 0.2s;
}

.dish-card:hover {
  transform: scale(1.015);
}

.dish-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 10px;
}

.dish-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}

.dish-desc {
  color: #555;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* максимум 2 строки */
  -webkit-box-orient: vertical;
}

.dish-meta {
  font-size: 12px;
  color: #333;
  margin-top: 6px;
}

.dish-image-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dish-image-wrapper img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
