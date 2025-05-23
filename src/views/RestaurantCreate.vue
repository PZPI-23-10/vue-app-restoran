<template>
  <div class="restaurant-constructor">
    <div class="first-section">
      <div class="photo-block" @click="triggerFileInput">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          style="display: none"
        />
        <img v-if="restaurantData.photo" :src="restaurantData.photo" class="photo-preview" />
        <div v-else class="photo-placeholder">+ Додати фото</div>
      </div>

      <div class="form-block">
        <input class="name-input" type="text" placeholder="Назва ресторану" v-model="restaurantData.name" />
        <textarea class="description-input" placeholder="Опис" v-model="restaurantData.description"></textarea>

      <div class="tags-wrapper">
        <div class="tag-select">
          <label>Кухня</label>
          <select @change="addTag($event, 'cuisine')">
            <option value="">Оберіть кухню</option>
            <option v-for="c in cuisineOptions" :key="c" :value="c">{{ c }}</option>
          </select>
          <div class="selected-tags">
            <span 
              v-for="(tag, index) in restaurantData.cuisine" 
              :key="tag"
              class="tag selected"
              @click="removeTag(index, 'cuisine')"
            >
              {{ tag }} ✕
            </span>
          </div>
        </div>

          <div class="tag-select">
            <label>Теги</label>
            <select @change="addTag($event, 'tags')">
              <option value="">Оберіть тег</option>
              <option v-for="t in tagOptions" :key="t" :value="t">{{ t }}</option>
            </select>
            <div class="selected-tags">
              <span 
                v-for="(tag, index) in restaurantData.tags" 
                :key="tag"
                class="tag selected"
                @click="removeTag(index, 'tags')"
              >
                {{ tag }} ✕
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="middle-buttons">
      <button @click="openDishesList" class="view-btn">
        🍽️ Переглянути меню
      </button>
      <button @click="openAddWorkHours">Графік роботи</button>

      <button @click="openManagersList" class="view-btn">
        👨‍🍳 Переглянути модераторів
      </button>
    </div> 
    <transition name="fade-slide">
    <DishesList 
      v-if="activeForm === 'dishes'"
      :visible="true"
      :dishes="dishes"
      @close="closeForm"
      @edit-dish="openEditDish"
      @add-dish="openAddDish"
      @delete-dish="handleDeleteDish"
    />
    </transition>

    <transition name="fade-slide">
    <ManagersList
      v-if="activeForm === 'managers'"
      :visible="true"
      :managers="restaurantData.managers"
      @close="closeForm"      
      @add="openAddManager"
      @edit="openEditManager"
      @delete="handleDeleteManager"
    />
    </transition>

    <transition name="fade-scale">
    <AddDish
      v-if="activeForm === 'dish'"
      :visible="true"
      :dishData="currentItem"
      @add-dish="handleAddDish"
      @update-dish="handleDishUpdate"
      @close="closeForm"
      @show-dishes="activeForm = 'dishes'"
    />
    </transition>

    <transition name="fade-slide">
    <AddManager
      v-if="activeForm === 'manager'"
      :workerData="currentItem"
      :visible="true"
      @submit="handleFormSubmit"
      @close="closeForm"
      @show-managers="activeForm = 'managers'"
    />
    </transition>

    <transition name="fade-slide">
    <AddWorkHours
      v-if="activeForm === 'hours'"
      :visible="true"
      @close="closeForm"
      @save="handleScheduleSave"
    />
    </transition>

    <div class="constructor-section">
      <div class="elements-layout">
        <div class="elements-left">
          <h3>Межі ресторану</h3>
          <div class="elements-vertical">
            <div 
              class="element-btn-vertical" 
              v-for="el in leftElements" 
              :key="el.id"
              draggable="true"
              @dragstart="(event) => onDragStart(el, event)"
            >
              <img :src="el.image" class="element-img" />
              <span>{{ el.title }}</span>
            </div>
          </div>
        </div>

        <div class="restaurant-layout-container">
        <div class="restaurant-grid" v-if="gridElements">
          <div
            v-for="(cell, index) in 120"
            :key="index"
            class="grid-cell"
            @dragover.prevent
            @drop="onDrop(index)"
          >
            <div
              v-if="gridElements[index]"
              class="grid-item"
              draggable="true"
              @dragstart="onGridItemDragStart(index)"
              @click.stop="handleGridItemClick(index)"
            >
              <img
                :src="gridElements[index].image"
                class="placed-element"
                :style="{ transform: 'rotate(' + (gridElements[index].rotation || 0) + 'deg)' }"
              />
            </div>
          </div>
        </div>

          <div class="floor-controls">
            <div class="floor-buttons">
              <button @click="addFloor">+ Додати поверх</button>
              <button @click="removeFloor" :disabled="restaurantData.layout.length === 1">- Видалити</button>
            </div>
            <div class="floor-tabs">
              <button
                v-for="(floor, index) in restaurantData.layout"
                :key="index"
                :class="{ active: index === activeFloorIndex }"
                @click="switchFloor(index)"
              >
                Поверх {{ index + 1 }}
              </button>
            </div>
          </div>
          <div class="elements-bottom">
            <h3>Конструктор</h3>
              <div class="mode-buttons">
                <button 
                  :class="['mode-btn', { active: interactionMode === 'default', green: interactionMode === 'default' }]"
                  @click="setInteractionMode('default')"
                >Переміщення</button>

                <button 
                  :class="['mode-btn', { active: interactionMode === 'rotate', blue: interactionMode === 'rotate' }]"
                  @click="setInteractionMode('rotate')"
                >Поворот</button>

                <button 
                  :class="['mode-btn', { active: interactionMode === 'delete', red: interactionMode === 'delete' }]"
                  @click="setInteractionMode('delete')"
                >Видалення</button>
              </div>
            <div class="elements-horizontal">
            <div 
              class="element-btn-horizontal" 
              v-for="el in bottomElements" 
              :key="el.id"
              draggable="true"
              @dragstart="(event) => onDragStart(el, event)"
            >
              <img :src="el.image" class="element-img" />
              <span>{{ el.title }}</span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="action-buttons">
      <button class="cancel-btn">Скасувати</button>
      <button class="publish-btn" @click="createRestaurant">Опублікувати (попередній перегляд)</button>
    </div>
  </div>
  <div v-if="successMessage" class="success-notification">{{ successMessage }}</div>
  <div v-if="errorMessage" class="error-notification">{{ errorMessage }}</div>
</template>

<script>
import DishesList from '../components/DishesList.vue';
import ManagersList from '../components/ManagersList.vue';
import AddDish from '../components/AddDish.vue';
import AddWorkHours from '../components/AddWorkHours.vue';
import AddManager from '../components/AddManager.vue';

export default {
  name: 'RestaurantCreate',
  components: {
    DishesList,
    ManagersList,
    AddDish,
    AddManager,
    AddWorkHours
  },
  data() {
    return {
      restaurantData: {
        name: '',
        description: '',
        photo: null,
        cuisine: [],
        tags: [],
        layout: [Array.from({ length: 120 }, () => null)],
        dishes: [],
        managers: []
      },
      selectedCuisine: [],
      selectedTags: [],
      activeForm: null,
      interactionMode: 'default',
      cuisineOptions: ['Італійська кухня', 'Українська кухня'],
      tagOptions: ['Романтика', 'Сімейне', 'Ділові зустрічі'],
      currentItem: null,
      rotationDuringDrag: 0,
      previewImage: null,
      draggedElement: null,
      errorMessage: '',
      successMessage: '',
      previewX: 0,
      previewY: 0,
      activeFloorIndex: 0,
      leftElements: [
        { id: 1, title: 'Пряма стіна', image: '/images/wall.png' },
        { id: 2, title: 'Окружність', image: '/images/circle.png' },
        { id: 3, title: 'Стіна "Трикутник"', image: '/images/triangle.png' },
        { id: 4, title: 'Двері', image: '/images/door.png' },
        { id: 5, title: 'Вікна', image: '/images/window.png' }
      ],
      bottomElements: [
        { id: 6, title: 'Місце на двох', image: '/images/tableForTwo.png' },
        { id: 7, title: 'Місце на багатьох', image: '/images/tableForMany.png' },
        { id: 8, title: 'Столи з диваном/кріслом', image: '/images/tableWithSofa.png' },
        { id: 9, title: 'Барна стійка', image: '/images/bar.png' },
        { id: 11, title: 'Сходи', image: '/images/stairs.png' }
      ],
    }
  },
  computed: {
    gridElements() {
      return this.restaurantData.layout[this.activeFloorIndex];
    }
  },
  created() {
    this.loadDishes();
    this.initializeData();
  },
  methods: {
    openForm(type, item = null) {
      this.activeForm = type;
      this.currentItem = item;
    },

    closeForm() {
      this.activeForm = null;
      this.currentItem = null;
    },

    openDishesList() {
      this.activeForm = 'dishes';
    },

    openManagersList() {
      this.activeForm = 'managers';
    },

    handleDeleteManager(id) {
      this.restaurantData.managers = this.restaurantData.managers.filter(manager => manager.id !== id);
      localStorage.setItem('restaurant_workers', JSON.stringify(this.restaurantData.managers));  
    },

    openAddManager() {
      this.currentItem = null;
      this.activeForm = 'manager';
    },

    openEditManager(manager) {
      this.currentItem = { ...manager };
      this.activeForm = 'manager';
    },

    closeManagerForm() {
      this.selectedManager = null;
      this.showManagerForm = false;
    },

    handleScheduleSave(schedule) {
      this.restaurantData.schedule = schedule;
    },
    
    handleFormSubmit(itemData) {
      const type = this.activeForm;
      const key = type === 'dish' ? 'dishes' : 'managers';
      const collection = this.restaurantData[key];

      if (itemData.id) {
        const index = collection.findIndex(i => i.id === itemData.id);
        if (index !== -1) collection.splice(index, 1, itemData);
      } else {
        itemData.id = Date.now();
        collection.push(itemData);
      }

      localStorage.setItem(`restaurant_${key}`, JSON.stringify(collection));

      this.restaurantData[key] = [...collection];

      if (type === 'dish') {
        this.activeForm = 'dishes';
        this.currentItem = null;
      } else {
        this.closeForm();
      }
    },

    handleDishUpdate(updatedDish) {
      const index = this.restaurantData.dishes.findIndex(d => d.id === updatedDish.id);
      if (index !== -1) {
        this.restaurantData.dishes.splice(index, 1, updatedDish);
        this.dishes = [...this.restaurantData.dishes];
        localStorage.setItem('restaurant_dishes', JSON.stringify(this.restaurantData.dishes));
      }

      this.activeForm = 'dishes';
      this.currentItem = null;
    },

    loadDishes() {
        try {
          const saved = localStorage.getItem('restaurant_dishes');
          this.dishes = saved ? JSON.parse(saved) : [];
          this.restaurantData.dishes = this.dishes;
        } catch (e) {
          console.error('Ошибка загрузки блюд:', e);
          this.dishes = [];
        }
      },
      initializeData() {
      if (!localStorage.getItem('restaurant_dishes')) {
        localStorage.setItem('restaurant_dishes', JSON.stringify([
          {
            id: 1,
            name: "Приклад",
            price: 100,
            weight: 300,
            ingredients: "Ваш текст"
          }
        ]));
      } else {
        this.dishes = JSON.parse(localStorage.getItem('restaurant_dishes'));
      }
      
      if (!localStorage.getItem('restaurant_workers')) {
        localStorage.setItem('restaurant_workers', JSON.stringify([
          {
            id: 1,
            email: "ivanPetrenko@gmail.com",
            phone: "+380991234567"
          }
        ]));
      } else {
        this.restaurantData.managers = JSON.parse(localStorage.getItem('restaurant_workers'));
      }
    },

    openAddDish() {
      this.openForm('dish');
    },
    openEditDish(dish) {
      this.openForm('dish', dish);
    },
    closeAddDish() {
      this.showAddDish = false;
      this.editingDish = null;
    },
   handleSaveDish(dish) {
      if (dish.id) {
        const index = this.restaurantData.dishes.findIndex(d => d.id === dish.id);
        if (index !== -1) {
          this.restaurantData.dishes.splice(index, 1, dish);
        }
      } else {
        dish.id = Date.now();
        this.restaurantData.dishes.push(dish);
      }
      this.closeAddDish();
    },

    openAddWorkHours() {
      this.activeForm = 'hours';
    },
        
    addFloor() {
      this.restaurantData.layout.push(Array(120).fill(null));
      this.activeFloorIndex = this.restaurantData.layout.length - 1;
    },

    removeFloor() {
      if (this.restaurantData.layout.length > 1) {
        this.restaurantData.layout.pop();
        this.activeFloorIndex = Math.max(0, this.activeFloorIndex - 1);
      }
    },

    switchFloor(index) {
      if (index >= 0 && index < this.restaurantData.layout.length) {
        this.activeFloorIndex = index;
      }
    },
    
    setInteractionMode(mode) {
      this.interactionMode = mode;
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    addTag(event, type) {
      const value = event.target.value;
      if (!value) return;

      if (type === 'cuisine' && !this.restaurantData.cuisine.includes(value)) {
        this.restaurantData.cuisine.push(value);
      }
      if (type === 'tags' && !this.restaurantData.tags.includes(value)) {
        this.restaurantData.tags.push(value);
      }

      event.target.selectedIndex = 0;
    },

    onGridItemDragStart(index) {
      this.draggedElement = {
        item: JSON.parse(JSON.stringify(this.gridElements[index])),
        index,
      };
    },
    
    saveDish(dishData) {
      if (this.currentDish) {
        const updated = this.restaurantData.dishes.map(d =>
          d.id === this.currentDish.id ? { ...dishData, id: d.id } : d
        );
        this.restaurantData.dishes = updated;
      } else {
        const newDish = { ...dishData, id: Date.now() };
        this.restaurantData.dishes.push(newDish);
      }
      this.activeForm = null;
      this.currentDish = null;
      localStorage.setItem('restaurant_dishes', JSON.stringify(this.restaurantData.dishes));
      this.dishes = [...this.restaurantData.dishes];
    },

    onDrop(index) {
      if (!this.draggedElement || !this.draggedElement.item) return;

      const draggedItem = this.draggedElement.item;

      this.gridElements[index] = {
        ...draggedItem,
        rotation: this.rotationDuringDrag,
      };

      if (typeof this.draggedElement.index === 'number') {
        this.gridElements[this.draggedElement.index] = null;
      }

      this.draggedElement = null;
      this.rotationDuringDrag = 0;
    },

    onDragStart(el, event) {
      this.draggedElement = { item: el };
      this.rotationDuringDrag = 0;

      this.previewX = event.clientX;
      this.previewY = event.clientY;
    },
    
    handleGridItemClick(index) {
      const element = this.gridElements[index];
      if (!element) return;

      if (this.interactionMode === 'rotate') {
        this.rotateElement(index);
      } else if (this.interactionMode === 'delete') {
        this.removeElement(index);
      }
    },

    rotateElement(index) {
      const element = this.gridElements[index];
      if (element) {
        const newRotation = (element.rotation || 0) + 90;
        this.gridElements[index] = {
          ...element,
          rotation: newRotation % 360,
        };
      }
    },

    removeElement(index) {
      this.gridElements[index] = null;
    },

    handleCellClick(index) {
      const element = this.gridElements[index];
      if (!element) return;

      const newRotation = (element.rotation || 0) + 90;
      this.gridElements[index] = {
        ...element,
        rotation: newRotation % 360,
      };
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.restaurantData.photo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    removeTag(index, type) {
      if (type === 'cuisine') this.restaurantData.cuisine.splice(index, 1);
      if (type === 'tags') this.restaurantData.tags.splice(index, 1);
    },   

    editWorker(worker) {
      this.currentWorker = worker;
      this.activeForm = 'workers';
      this.showManagersList = false;
    },

    handleAddDish(dish) {
      dish.id = Date.now();
      this.restaurantData.dishes.push(dish);

      localStorage.setItem('restaurant_dishes', JSON.stringify(this.restaurantData.dishes));

      this.dishes = [...this.restaurantData.dishes];

      this.openDishesList();
    },


    editHours(day) {
      console.log('Редактируем график для дня:', day);
    },

    handleDeleteDish(dishId) {
      try {
        const updatedDishes = this.restaurantData.dishes.filter(d => d.id !== dishId);
        this.restaurantData.dishes = updatedDishes;
        this.dishes = updatedDishes;

        localStorage.setItem('restaurant_dishes', JSON.stringify(updatedDishes));

        this.activeForm = null;
        this.currentItem = null;

        this.$nextTick(() => {
          this.activeForm = 'dishes';
        });
      } catch (error) {
        console.error('Ошибка при удалении блюда:', error);
      }
    },
    async createRestaurant() {
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const response = await fetch('https://backend-restoran.onrender.com/api/Restaurant/Create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.restaurantData),
        });

        const data = await response.json();

        if (!response.ok) {
          this.errorMessage = data.message || `Ошибка: ${response.status}`;
          return;
        }

        this.successMessage = 'Ресторан успешно создан!';
      } catch (error) {
        this.errorMessage = 'Ошибка при выполнении запроса. Попробуйте позже.';
        console.error(error);
      }
    }
  }
}

</script>


<style scoped>
.restaurant-constructor {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: auto;
}

.first-section {
  display: flex;
  gap: 24px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.photo-block {
  width: 300px;
  height: 300px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
}

.photo-placeholder {
  font-size: 16px;
  color: #aaa;
  text-align: center;
}

.photo-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.form-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name-input,
.description-input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.selected-tags-row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.selected-tags-block {
  flex: 1;
}

.selected-tags-block h4 {
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.tag-select-block {
  display: flex;
  flex-direction: column;
  width: 48%;
}

.tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  background-color: #eee;
  color: #333;
}

.tags-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}

.tag-select {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-select select {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 50l60 60 60-60' fill='none' stroke='%23666' stroke-width='15'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.tag-select select:focus {
  outline: none;
  border-color: #FF6F61;
}
.floor-controls {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.floor-controls button {
  padding: 6px 12px;
  margin: 2px;
  border: none;
  border-radius: 6px;
  background-color: #eee;
  cursor: pointer;
  transition: 0.2s ease;
}

.floor-controls button:hover {
  background-color: #ccc;
}

.floor-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
}

.floor-tabs button {
  padding: 5px 10px;
  background-color: #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.floor-tabs button.active {
  background-color: #4caf50;
  color: white;
}
.tag.selected {
  background-color: #FF6F61;
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.tag.active {
  background-color: #FF6F61;
  color: white;
}

.middle-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.middle-buttons button {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #FF9C2B;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.middle-buttons button:hover {
  background-color: #e68922;
}

.constructor-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.elements-layout {
  display: flex;
  gap: 24px;
}

.elements-left {
  width: 160px;
  height: 750px;
  overflow-y: auto;
  border: 0px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  background-color: #f5f5f5;
}

.elements-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.element-btn-vertical {
  width: 90px;
  height: 90px;
  background: #fff;
  border: 1px solid #aaa;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  text-align: center;
  cursor: grab;
}


.element-btn-vertical img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}
.elements-bottom {
  margin-top: 16px;
}

.elements-horizontal {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  width: 660px;
  height: 140px;
  overflow-y: auto;
  border-radius: 8px;
  padding: 8px;
  background-color: #f5f5f5;
}

.element-btn-horizontal {
  width: 110px;
  height: 120px;
  background: #fff;
  border: 1px solid #aaa;
  border-radius: 6px;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  font-size: 13px;
  box-sizing: border-box;
}

.element-btn-horizontal span {
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 4px;
}

.element-btn-horizontal img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.element-img {
  object-fit: contain;
}

.restaurant-area {
  flex: 1;
}

.restaurant-grid {
  width: 624px;
  height: 520px;
  display: grid;
  grid-template-columns: repeat(12, 0fr);
  grid-template-rows: repeat(10, 0fr);
  gap: 0px;
  border: 2px solid #aaa;
  background: none;
  border-radius: 2px;
  position: relative;
}

.grid-cell {
  position: relative;
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
}

.grid-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.placed-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.mode-toggle {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  align-items: center;
}

.mode-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.mode-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
}

.mode-btn.green {
  background-color: #4CAF50;
}

.mode-btn.blue {
  background-color: #2196F3;
}

.mode-btn.red {
  background-color: #F44336;
}

.mode-btn:not(.green):not(.blue):not(.red) {
  background-color: #aaa;
}

.mode-btn:hover {
  filter: brightness(1.1);
}

.mode-btn.active {
  border: 2px solid #333;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
}

.mode-toggle label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.element-controls {
  position: absolute;
  top: 2px;
  right: 2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.element-controls button {
  font-size: 12px;
  padding: 2px;
  background: rgba(255,255,255,0.8);
  border: 1px solid #aaa;
  border-radius: 2px;
  cursor: pointer;
}

.interaction-buttons {
  display: inline-flex;
  gap: 8px;
  margin-left: 20px;
  vertical-align: middle;
}

.interaction-buttons button {
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
}

.interaction-buttons button.active {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-buttons button {
  flex: 1;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
}

.cancel-btn {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #ccc;
  color: #333;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background-color: #bbb;
}

.publish-btn {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #FF6F61;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mode-buttons button.active {
  background-color: #4caf50;
  color: white;
}

.publish-btn:hover {
  background-color: #e55a4c;
}

.drag-preview {
  z-index: 9999;
  pointer-events: none;
  transition: transform 0.1s ease-in-out;
}
.preview-img {
  width: 50px;
  height: 50px;
  opacity: 0.8;
}
.data-manager-buttons {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}

.data-manager-btn {
  flex: 1;
  padding: 12px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.data-manager-btn:hover {
  background-color: #e55a4c;
  transform: translateY(-2px);
}

.data-manager-btn span {
  font-size: 20px;
}

.error-message {
  padding: 10px;
  margin: 10px 0;
  background-color: #fdd;
  color: #900;
  border: 1px solid #900;
  border-radius: 4px;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.25s ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

</style>