<template>
  <div class="filter-buttons-container">
    <div class="filter-buttons">
     <button
        class="filter-btn favorites"
        @click="toggleDropdown"
        >
        Обрані
        <span class="material-icons arrow" :class="{ rotated: dropdownOpen }">expand_more</span>
        </button>

      <!-- Разделитель между "Обрані" и остальными фильтрами -->
      <div class="separator"></div>

      <!-- Теги фильтров -->
      <div class="filter-tags">
        <button
          v-for="(category, index) in categories"
          :key="index"
          :class="['filter-btn', { selected: selectedCategory === category }]"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Выпадающий список для "Обрані" -->
    <div v-if="dropdownOpen" class="dropdown-menu">
      <button @click="selectCategory('Обрані')">Обрані</button>
      <!-- Можешь добавить дополнительные опции здесь, если нужно -->
    </div>

    <!-- Линия после фильтров, на всю ширину -->
    <div class="bottom-line"></div>
  </div>
</template>

<script>
export default {
  name: 'FilterButtons',
  data() {
    return {
      selectedCategory: 'Обрані', // Начальная категория
      dropdownOpen: false, // Состояние для выпадающего списка
      categories: [
        'Італійська',
        'Мексиканська',
        'Морепродукти',
        'Вегетаріанська',
        'Японська',
        'Суші',
        'Піцца'
      ]
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen; // Открытие/закрытие выпадающего списка
    },
    selectCategory(category) {
      this.selectedCategory = category; // Обновление выбранной категории
    }
  }
};
</script>

<style scoped>
.filter-buttons-container {
  width: 100%;
  margin-top: 20px;
  box-sizing: border-box;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-left: 20px;
}
.filter-btn {
  border: 1px solid black;
  border-radius: 12px;
  padding: 8px 16px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center; /* Центровка текста и стрелки */
  min-width: 100px; /* 👈 Задаёт минимальную ширину */
  box-sizing: border-box;
}


.filter-btn.selected {
  border: 1.5px solid #f55;
  color: #f55;
}
.filter-btn.favorites {
  min-width: 100px; 
  margin-right: 10px;
}

.separator {
  width: 1px;
  height: 30px;
  background-color: black;
}

.filter-tags {
  display: flex;
  gap: 10px;
  margin-left: 10px;
}

.arrow {
  margin-left: 5px;
  font-size: 18px; /* Уменьшаем размер стрелки */
  transition: transform 0.3s ease;
}

.arrow.rotated {
  transform: rotate(180deg); /* Поворот стрелки */
}

.dropdown-menu {
  position: absolute;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
  margin-top: 5px;
  width: 120px;
  z-index: 10;
}

.dropdown-menu button {
  width: 100%;
  padding: 8px;
  border: none;
  background-color: white;
  text-align: left;
  cursor: pointer;
}

.dropdown-menu button:hover {
  background-color: #f0f0f0;
}

/* Линия, которая идет на всю ширину */
.bottom-line {
  width: 100%;
  height: 1px;
  background-color: black; /* Линия */
  margin-top: 20px;
}
</style>
