<template>
  <div class="restaurant-list">
    <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="restaurant-card">
      <h3>{{ restaurant.name }}</h3>
      <div class="ratings">
        <span>{{ restaurant.rating }} ★</span>
      </div>
      <div class="details">
        <span>{{ restaurant.type }}</span>
        <span>{{ restaurant.address }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RestaurantList',
  data() {
    return {
      restaurants: [
        { id: 1, name: 'Пузата хата', rating: 4.3, type: 'Традиційна їжа', address: 'Київ вул. Вокзальна 42' },
        { id: 2, name: 'Італійська хата', rating: 4.1, type: 'Італійська', address: 'Київ вул. Контрактова' },
        { id: 3, name: 'Мексиканський кортель', rating: 3.9, type: 'Мексиканська', address: 'Київ вул. Вокзальна 50' }
      ],
      selectedCategory: null // Храним выбранную категорию
    }
  },
  computed: {
    // Фильтруем рестораны по выбранной категории
    filteredRestaurants() {
      if (this.selectedCategory) {
        return this.restaurants.filter(restaurant => restaurant.type === this.selectedCategory)
      }
      return this.restaurants // Если категория не выбрана, показываем все рестораны
    }
  }
}
</script>

<style scoped>
.restaurant-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.restaurant-card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
}

.ratings {
  color: #FFD700;
}

.details {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
</style>
