<template>
  <div class="location-dropdown" ref="dropdownRef">
    <span class="material-icons" @click="toggle">location_on</span>

    <div v-if="open" class="dropdown">
      <div class="arrow-up"></div>

      <div class="table">
        <div class="column">
          <div class="header">Область</div>
          <div
            v-for="region in Object.keys(locations)"
            :key="region"
            class="item"
            :class="{ selected: selectedRegion === region }"
            @click="selectRegion(region)"
          >
            {{ region }}
          </div>
        </div>
        <div class="column">
          <div class="header">Місто</div>
          <div
            v-for="city in locations[selectedRegion]"
            :key="city"
            class="item"
            @click="goToRestaurantPage(city)" 
          >
            {{ city }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const open = ref(false)
const selectedRegion = ref('Запорізька')

const dropdownRef = ref(null)
const router = useRouter()

const locations = {
  Запорізька: ['Київ', 'Харків'],
  Львівська: ['Львів', 'Дрогобич'],
  Одеська: ['Одеса', 'Ізмаїл']
}

// Открытие/закрытие дропдауна
function toggle() {
  open.value = !open.value
}

function selectRegion(region) {
  selectedRegion.value = region
}

// Переход на страницу ресторана
function goToRestaurantPage(city) {
  router.push({ name: 'RestaurantPageList', params: { city } })
  open.value = false
}


// Закрытие дропдауна при клике вне компонента
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.material-icons {
  outline: none;
  user-select: none;
}

*:focus {
  outline: none;
}

.material-icons:focus {
  outline: none;
}

.location-dropdown {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 32px;
  background: white;
  border: 1px solid #000;
  z-index: 100;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid black;
  margin: 0 auto;
  position: absolute;
  top: -10px;
}

.table {
  display: flex;
  width: 300px;
}

.column {
  flex: 1;
  border-left: 1px solid black;
}

.column:first-child {
  border-left: none;
}

.header {
  font-weight: bold;
  padding: 6px;
  border-bottom: 1px solid black;
}

.item {
  padding: 6px;
  cursor: pointer;
}

.marker-wrapper {
  display: flex;
  align-items: center;
}

.material-icons {
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}

.selected {
  background-color: #e0f7fa;
}
</style>
