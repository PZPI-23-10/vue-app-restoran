<template>
  <div class="dishes-list">
    <div v-if="dishes.length > 0">
      <div v-for="dish in dishes" :key="dish.id" class="dish-card">
        <img :src="dish.photoUrl" alt="Фото блюда" />
        <div class="dish-info">
          <div class="dish-title">{{ dish.title }}</div>
          <div class="dish-desc">{{ dish.ingredients }}</div>
          <div class="dish-meta">{{ dish.weight }} г • {{ dish.price }} грн</div>
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
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.dish-card {
  display: flex;
  gap: 15px;
  background: #fff;
  border-radius: 10px;
  padding: 10px 15px;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.dish-card img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dish-title {
  font-weight: bold;
  font-size: 18px;
}

.dish-desc {
  color: #555;
  font-size: 14px;
}

.dish-meta {
  font-size: 14px;
  color: #333;
}
</style>
