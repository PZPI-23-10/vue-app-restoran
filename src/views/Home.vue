<template>
  <div class="home-page">
    <div class="filters-wrapper">
      <div class="filters">
        <div class="filter-group">
          <DatePicker />


          <DropdownSelect
            icon="access_time"
            v-model="time"
            :options="timeOptions"
          />


          <DropdownSelect
            icon="person"
            v-model="people"
            :options="peopleOptions"
          />
        </div>
        <div class="filter-search">
          <span class="material-icons">search</span>
          <input type="text" placeholder="Місто, Ресторан" />
        </div>
      </div>
    </div>

    <h2 class="cities-title">Міста з якими працює сервіс для ресторанів</h2>

    <div class="city-grid">
      <div class="city-item">Київ   <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
      <div class="city-item">Місто   <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
      <div class="city-item">Місто  <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
      <div class="city-item">Місто   <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
      <div class="city-item">Місто   <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
      <div class="city-item">Місто   <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
      <div class="city-item">Місто   <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
      <div class="city-item">Місто   <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
      <div class="city-item">Місто   <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DatePicker from '../components/DatePicker.vue'
import DropdownSelect from '../components/DropdownSelect.vue'

const time = ref('19:00')
const timeOptions = [
  { label: '09:00', value: '09:00' },
  { label: '09:30', value: '09:30' },
  { label: '10:00', value: '10:00' },
  { label: '10:30', value: '10:30' },
  { label: '11:00', value: '11:00' },
  { label: '11:30', value: '11:30' },
  { label: '12:00', value: '12:00' },
  { label: '12:30', value: '12:30' },
  { label: '13:00', value: '13:00' },
  { label: '13:30', value: '13:30' },
  { label: '14:00', value: '14:00' },
  { label: '14:30', value: '14:30' },
  { label: '15:00', value: '15:00' },
  { label: '15:30', value: '15:30' },
  { label: '16:00', value: '16:00' },
  { label: '16:30', value: '16:30' },
  { label: '17:00', value: '17:00' },
  { label: '17:30', value: '17:30' },
  { label: '18:00', value: '18:00' },
  { label: '18:30', value: '18:30' },
  { label: '19:00', value: '19:00' },
  { label: '19:30', value: '19:30' }
]

const people = ref(2)
const peopleOptions = [
  { label: '1 людина', value: 1 },
  { label: '2 людини', value: 2 },
  { label: '3 людини', value: 3 },
  { label: '4 людини', value: 4 },
  { label: '5 людей', value: 5 },
  { label: '6 людей', value: 6 }
]
</script>

<style scoped>
.home-page {
  padding: 80px;
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

.filter-group > * {
  border: none;
  border-right: 1px solid #333;
  border-radius: 0;
}

.filter-group > *:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-left: 1px solid #333;
}

.filter-group > *:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-right: none;
}
.filter-box,
.date-picker-input,
.dropdown-toggle {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  gap: 6px;
  background-color: white;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  flex-shrink: 0;
}
.arrow {
  font-size: 16px;
  transition: transform 0.3s ease;
}
.arrow.rotated {
  transform: rotate(180deg);
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
.divider {
  width: 1px;
  background-color: #ccc;
}
.cities-title {
  font-size: 18px;
  margin: 40px 0 10px;
  border-bottom: 2px solid #00BCD4;
  display: inline-block;
  padding-bottom: 5px;
}
.city-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}
.city-item {
  font-size: 16px;
}
</style>