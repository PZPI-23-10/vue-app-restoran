<template>
  <div>

    <div class="restaurant-page-content">
      <FilterButtons />

      <div class="restaurant-page-container">
        <div class="restaurant-list">
          <RestaurantList :selectedCity="selectedCity" />

        </div>

        <div class="restaurant-map">
        <RestaurantMap :selectedCity="selectedCity" />



        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainMenu from '../components/MainMenu.vue'
import FilterButtons from '../components/FilterButtons.vue'
import RestaurantList from '../components/RestaurantList.vue'
import RestaurantMap from '../components/RestaurantMap.vue'
export default {
  name: 'RestaurantPage',
  props: {
    selectedCity: {
      type: String,
      default: 'Київ'
    }
  },
  components: {
    MainMenu,
    FilterButtons,
    RestaurantList,
    RestaurantMap
  }
}

</script>


<style scoped>

.restaurant-page-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-buttons {
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.restaurant-page-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.restaurant-list {
  flex: 1;
  min-width: 300px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.separator {
  width: 1px;
  background-color: black; /* Цвет разделителя */
  height: auto;
  min-height: 300px; /* Минимальная высота разделителя */
  margin: auto; /* Выравнивание по центру */
}

/* Стили для карты */
.restaurant-map {
  flex: 1.5; /* Растягиваем карту на большее пространство */
  min-width: 400px; /* Минимальная ширина карты */
  background-color: #e0e0e0; /* Фоновый цвет */
  padding: 20px;
  border-radius: 8px; /* Закругленные углы */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Тень */
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .restaurant-page-container {
    flex-direction: column; /* Список и карта будут располагаться друг под другом на мобильных устройствах */
  }

  .restaurant-list,
  .restaurant-map {
    min-width: 100%; /* Ширина 100% на мобильных */
  }

  .separator {
    display: none;
  }
}
</style>
