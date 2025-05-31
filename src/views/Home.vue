<template>
  <div class="home-page">
    <div class="filters-wrapper">
      <div class="filters">
        <div class="filter-group">
          <DatePicker />
          <DropdownSelect icon="access_time" v-model="time" :options="timeOptions" />
          <DropdownSelect icon="person" v-model="people" :options="peopleOptions" />
        </div>

        <div class="filter-search">
          <span class="material-icons">search</span>
          <input type="text" placeholder="Місто, Ресторан" />
        </div>
      </div>
    </div>

    <h2 class="cities-title">Популярні ресторани</h2>

    <div class="restaurant-grid">
      <div class="restaurant-card"
           v-for="restaurant in displayedRestaurants"
           :key="restaurant.id"
           @click="goToRestaurant(restaurant.id)">
        <img :src="restaurant.photoUrl" alt="Фото ресторану" class="restaurant-img" />
        <div class="restaurant-card-content">
          <h3>{{ restaurant.name }}</h3>
          <p>{{ restaurant.city }}, {{ restaurant.street }}</p>
          <p>{{ restaurant.cuisines?.[0]?.cuisine?.name || 'Без кухні' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import DatePicker from '../components/DatePicker.vue'
import DropdownSelect from '../components/DropdownSelect.vue'

// 🔧 глобальный кэш (будет жить в памяти при навигации между страницами)
const cachedRestaurants = ref(null)

const router = useRouter()

const time = ref('19:00')
const people = ref(2)
const restaurants = ref([])

const timeOptions = [
  { label: '09:00', value: '09:00' },
  { label: '10:00', value: '10:00' },
  { label: '11:00', value: '11:00' },
  { label: '12:00', value: '12:00' },
  { label: '13:00', value: '13:00' },
  { label: '14:00', value: '14:00' },
  { label: '15:00', value: '15:00' },
  { label: '16:00', value: '16:00' },
  { label: '17:00', value: '17:00' },
  { label: '18:00', value: '18:00' },
  { label: '19:00', value: '19:00' },
  { label: '20:00', value: '20:00' }
]

const peopleOptions = [
  { label: '1 людина', value: 1 },
  { label: '2 людини', value: 2 },
  { label: '3 людини', value: 3 },
  { label: '4 людини', value: 4 },
  { label: '5 людей', value: 5 },
  { label: '6 людей', value: 6 }
]

onMounted(async () => {
  if (cachedRestaurants.value) {
    restaurants.value = cachedRestaurants.value
    return
  }

  try {
    const response = await axios.get('https://backend-restoran.onrender.com/api/Restaurant')
    restaurants.value = response.data ?? []
    cachedRestaurants.value = restaurants.value
  } catch (error) {
    console.error('Помилка при завантаженні ресторанів:', error)
  }
})

// ограничим 4 ресторана
const displayedRestaurants = computed(() => restaurants.value.slice(0, 4))

function goToRestaurant(id) {
  router.push(`/restaurant/${id}`)
}
</script>

<style scoped>
.home-page {
  padding: 60px 40px;
  font-family: 'Poppins', sans-serif;
}

.filters-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.filter-group {
  display: flex;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: visible;
  position: relative;
}

.filter-search {
  display: flex;
  align-items: center;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px 12px;
  gap: 8px;
  flex-shrink: 0;
  background-color: white;
}

.filter-search input {
  border: none;
  outline: none;
  font-size: 14px;
  background: none;
  width: 160px;
}

.cities-title {
  font-size: 24px;
  margin: 40px 0 20px;
  border-bottom: 3px solid #00BCD4;
  display: inline-block;
  padding-bottom: 10px;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 40px;
  margin-top: 20px;
  justify-content: center;
}

.restaurant-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.restaurant-img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f9f9f9;
  padding: 15px;
}

.restaurant-card-content {
  padding: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.restaurant-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #222;
}

.restaurant-card p {
  font-size: 14px;
  color: #555;
  margin: 0;
}
</style>
