<template>
  <div class="restaurant-details">
    <img :src="restaurant.image" alt="Фото ресторану" class="restaurant-image" />

    <div class="info">
      <h2>
        {{ restaurant.name }}
        <span class="stars">★ {{ restaurant.rating }}</span>
      </h2>

      <p class="description">{{ restaurant.description }}</p>

      <div class="row">
        <div>
          <strong>Кухня</strong><br />
          {{ restaurant.type }}
        </div>
        <div>
          <strong>Теги</strong><br />
          {{ restaurant.tags.join(', ') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: Object
})
</script>

<style scoped>
.restaurant-details {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.restaurant-image {
  width: 400px;
  height: auto;
  border-radius: 8px;
}

.info {
  flex: 1;
}

.stars {
  color: #FFD700;
  font-size: 18px;
  margin-left: 10px;
}

.description {
  margin: 10px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}
</style>
