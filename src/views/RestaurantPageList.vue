<template>
  <div>

    <div class="restaurant-page-content">
      <FilterButtons />

      <div class="restaurant-page-container">
        <div class="restaurant-list">
          <RestaurantList />
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
/* Общие стили для контента ресторана */
.restaurant-page-content {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Отступ между фильтрами и остальным контентом */
}

/* Фильтры */
.filter-buttons {
  width: 100%;  /* Фильтр займет всю ширину */
  display: flex;
  gap: 12px;
  justify-content: center; /* Выравнивание по центру */
  margin-bottom: 20px; /* Отступ снизу */
}

/* Контейнер для списка ресторанов и карты */
.restaurant-page-container {
  display: flex;
  gap: 20px; /* Отступ между списком ресторанов и картой */
  justify-content: space-between;
  flex-wrap: wrap; /* Для адаптивности на мобильных устройствах */
}

/* Стили для списка ресторанов */
.restaurant-list {
  flex: 1; /* Растягиваем на доступное пространство */
  min-width: 300px; /* Минимальная ширина */
  background-color: #f9f9f9; /* Фоновый цвет */
  padding: 20px;
  border-radius: 8px; /* Закругленные углы */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Тень */
}

/* Разделитель между списком ресторанов и картой */
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
