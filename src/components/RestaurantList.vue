<template>
  <div class="restaurant-list">
    <!-- Выводим список ресторанов -->
    <div
      v-for="restaurant in filteredRestaurants"
      :key="restaurant.id"
      class="restaurant-card"
    >
      <!-- Название ресторана -->
      <h3 v-if="restaurant.name" class="clickable" @click="goToRestaurant(restaurant.id)">
        {{ restaurant.name }}
      </h3>

      <!-- Фото ресторана -->
      <img
        v-if="restaurant.photoUrl"
        :src="restaurant.photoUrl"
        alt="Фото ресторану"
        class="restaurant-image"
      />

      <!-- Город и регион -->
      <div class="ratings">
        {{ restaurant.city }} — {{ restaurant.region }}
      </div>

      <!-- Улица и email -->
      <div class="details">
        <span>{{ restaurant.street }}</span>
        <span>{{ restaurant.email }}</span>
      </div>
    </div>

    <!-- Отладочная информация -->
    <pre>{{ filteredRestaurants }}</pre>
  </div>
</template>

<script>
import { fetchRestaurants } from '../services/api'
import { useRouter } from 'vue-router'

export default {
  name: 'RestaurantList',
  props: {
    selectedCity: {
      type: String,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    const goToRestaurant = (id) => {
      router.push({ name: 'RestaurantPage', params: { id } })
    }
    return { goToRestaurant }
  },
  data() {
    return {
      restaurants: [],
      selectedCategory: null
    }
  },
  computed: {
    filteredRestaurants() {
      // Фильтрация по місту (обов’язково перевірка на наявність даних)
      return this.restaurants.filter(r => r.city && r.city === this.selectedCity)
    }
  },
  watch: {
    selectedCity: {
      immediate: true,
      handler() {
        this.loadRestaurants()
      }
    }
  },
  methods: {
    async loadRestaurants() {
      try {
        const response = await fetchRestaurants()
        console.log('Отримано з API:', response.data) // 👈 лог на перевірку
        this.restaurants = response.data
      } catch (error) {
        console.error('Помилка при завантаженні ресторанів:', error)
      }
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

.restaurant-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.ratings {
  font-weight: bold;
}

.details {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-top: 5px;
}

.clickable {
  cursor: pointer;
  color: #2c3e50;
  transition: color 0.2s;
}
.clickable:hover {
  color: #42b983;
}
</style>
