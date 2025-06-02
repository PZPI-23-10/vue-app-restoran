  <template>
    <div class="favorite-dishes">
      <h3>Улюблені страви</h3>

      <div v-if="dishes.length > 0" class="dishes-list">
        <div v-for="dish in dishes" :key="dish.id" class="dish-card">
          <img :src="dish.photoUrl" alt="Фото страви" />
          <div class="dish-info">
            <div class="dish-title">{{ dish.title }}</div>
            <div class="dish-desc">{{ dish.ingredients }}</div>
            <div class="dish-meta">{{ dish.weight }} г • {{ dish.price }} грн</div>
          </div>
        </div>
      </div>

      <p v-else>У вас ще немає улюблених страв.</p>
    </div>
  </template>

  <script setup>
  const props = defineProps({
  dishes: {
    type: Array,
    default: () => []
  }
})


  </script>

  <style scoped>
  .favorite-dishes {
    padding: 20px;
  }

  .dishes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 15px;
  }

  .dish-card {
    width: 200px;
    background: #f9f9f9;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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

  .dish-meta {
    font-size: 14px;
    color: #333;
  }
  </style>
