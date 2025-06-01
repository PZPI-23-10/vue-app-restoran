<template>
  <div class="restaurant-constructor">
    <div class="restaurant-info-card">
      <div class="photo-form-wrapper">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleGalleryChange"
          style="display: none"
        />

        <div class="gallery-container">
          <button class="gallery-arrow left" @click.stop="prevPhoto">&lt;</button>

          <div class="gallery-frame" @click="handleSlotClick">
            <img
              v-if="restaurantData.gallery[activeIndex]"
              :src="restaurantData.gallery[activeIndex]"
              class="preview-image"
              alt="Фото ресторана"
            />
            <div v-else class="photo-placeholder">+ Додати фото</div>
          </div>

          <button class="gallery-arrow right" @click.stop="nextPhoto">&gt;</button>
        </div>

        <div class="gallery-controls">
          <!-- Индикаторы -->
          <div class="gallery-indicators">
            <span
              v-for="(img, index) in maxSlots"
              :key="index"
              :class="['dot', { active: index === activeIndex }]"
            ></span>
          </div>

          <!-- Кнопка удаления -->
          <button
            v-if="restaurantData.gallery[activeIndex]"
            class="remove-photo"
            @click="removePhoto(activeIndex)"
          >
            ✕ Удалити фото
          </button>
        </div>
      </div>


      <div class="form-block">
        <input class="name-input" type="text" placeholder="Назва ресторану" v-model="restaurantData.name" />
        <textarea class="description-input" placeholder="Опис" v-model="restaurantData.description"></textarea>
    <div class="dress-code-section">
      <div class="dress-code-row">
        <div class="tag-select">
          <label>Дресс-код</label>
          <select @change="addTag($event, 'dressCode')">
            <option value="">Оберіть варіант</option>
            <option v-for="d in dressCodeOptions" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>

          <div class="selected-tags">
            <span
              v-for="(tag, index) in restaurantData.dressCode"
              :key="tag.id"
              class="tag selected"
              @click="removeTag(index, 'dressCode')"
            >
              {{ tag.name }} ✕
            </span>
          </div>
        </div>

        <div class="checkbox-pair">
          <label class="option-checkbox">
            <input type="checkbox" v-model="restaurantData.hasParking" />
            🚗
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="restaurantData.accessible" />
            ♿
          </label>
        </div>
      </div>
      <div class="tags-wrapper">
        <div class="tag-select">
          <label>Кухня</label>
          <select @change="addTag($event, 'cuisine')">
            <option value="">Оберіть кухню</option>
            <option v-for="c in cuisineOptions" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <div class="selected-tags">
            <span 
              v-for="(tag, index) in restaurantData.cuisine" 
              :key="tag.id"
              class="tag selected"
              @click="removeTag(index, 'cuisine')"
            >
              {{ tag.name }} ✕
            </span>
          </div>
        </div>

          <div class="tag-select">
            <label>Теги</label>
            <select @change="addTag($event, 'tags')">
              <option value="">Оберіть тег</option>
              <option v-for="t in tagOptions" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
            <div class="selected-tags">
              <span 
                v-for="(tag, index) in restaurantData.tags" 
                :key="tag.id"
                class="tag selected"
                @click="removeTag(index, 'tags')"
              >
                {{ tag.name }} ✕
              </span>
            </div>
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
    <button class="cancel-btn" @click="showConfirm = true">Скасувати</button>

    <transition name="fade-slide">
    <ConfirmCancelModal 
      v-if="showConfirm"
      title="Скасувати створення ресторану?"
      message="Всі введені дані буде втрачено. Продовжити?"
      confirmText="Так, скасувати"
      cancelText="Ні, залишитись"
      @confirm="cancelCreation"
      @close="showConfirm = false"
    />
    </transition>
  
    <button class="publish-btn" @click="createRestaurant">Опублікувати</button>
    </div>
  </div>
</template>

<script>
import DishesList from '../components/DishesList.vue';
import ManagersList from '../components/ManagersList.vue';
import AddDish from '../components/AddDish.vue';
import AddWorkHours from '../components/AddWorkHours.vue';
import AddManager from '../components/AddManager.vue';
import ConfirmCancelModal from '../components/ConfirmCancelModal.vue';


export default {
  name: 'RestaurantCreate',
  components: {
    DishesList,
    ManagersList,
    AddDish,
    AddManager,
    AddWorkHours,
    ConfirmCancelModal
  },

  mounted() {
    this.fetchOptions();
  },

  data() {
    return {
      restaurantData: {
        name: '',
        description: '',
        gallery: Array(4).fill(""),
        dressCode: [], 
        hasParking: false, // 🚗
        accessible: false, // ♿ 
        cuisine: [],
        tags: [],
        layout: [Array.from({ length: 120 }, () => null)],
        dishes: [],
        moderatorEmails: [],
        schedule: [],
        street: '',
        city: '',        
        region: '',        
        email: '',
        organization: '',    
      },
      showConfirm: false,
      dressCodeOptions: [],
      cuisineOptions: [],
      tagOptions: [],
      activeForm: null,
      interactionMode: 'default',
      cuisineOptions: ['Італійська кухня', 'Українська кухня'],
      tagOptions: ['Романтика', 'Сімейне', 'Ділові зустрічі'],
      currentItem: null,
      rotationDuringDrag: 0,
      previewImage: null,
      draggedElement: null,
      previewX: 0,
      previewY: 0,
      activeFloorIndex: 0,
      activeIndex: 0,
      maxSlots: 4,
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
        { id: 10, title: 'Сходи', image: '/images/stairs.png' }
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

    const query = this.$route.query;

    this.restaurantData.address = query.address || '';
    this.restaurantData.email = query.email || '';
    this.restaurantData.organization = query.organization || '';
  },
  methods: {
    getNameById(category, id) {
      let optionsMap = {
        dressCode: this.dressCodeOptions,
        cuisine: this.cuisineOptions,
        tags: this.tagOptions,
      };
      const option = optionsMap[category].find(o => o.id === id);
      return option ? option.name : 'Неизвестно';
    },

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

    handleSlotClick() {
      if (!this.restaurantData.gallery[this.activeIndex]) {
        this.$refs.fileInput.click();
      }
    },

    handleGalleryChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.restaurantData.gallery[this.activeIndex] = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    nextPhoto() {
      this.activeIndex = (this.activeIndex + 1) % this.maxSlots;
    },

    prevPhoto() {
      this.activeIndex =
        (this.activeIndex - 1 + this.maxSlots) % this.maxSlots;
    },

    removePhoto(index) {
       this.restaurantData.gallery[index] = null;
    },

    handleScheduleSave(schedule) {
      this.restaurantData.schedule = schedule;
    },
    
    handleFormSubmit(manager) {
      if (!manager || !manager.email) {
        console.warn('Не передана почта менеджера');
        return;
      }

      const email = manager.email.trim();
      if (!email) return;

      const collection = this.restaurantData.managers || [];

      const index = collection.findIndex(m => m.email === email);

      if (index !== -1) {
        collection.splice(index, 1, { email });
      } else {
        collection.push({ email });
      }

      localStorage.setItem('restaurant_managers', JSON.stringify(collection));
      this.restaurantData.managers = [...collection];

      this.closeForm();
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
            email: "example@gmail.com",
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

addTag(event, field) {
  const selectedValue = event.target.value;
  if (!selectedValue) return;

  let options;

  if (field === 'cuisine') {
    options = this.cuisineOptions;
  } else if (field === 'tags') {
    options = this.tagOptions;
  } else if (field === 'dressCode') {
    options = this.dressCodeOptions;
  }

  if (!options) {
    console.error(`Options for ${field} not found`);
    return;
  }

  const selectedObj = options.find(o => o.id == selectedValue);
  if (selectedObj && !this.restaurantData[field].some(t => t.id === selectedObj.id)) {
    this.restaurantData[field].push(selectedObj);
  }

  event.target.value = '';
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

    async fetchOptions() {
      try {
        const response = await fetch('https://backend-restoran.onrender.com/api/Tag');
        if (!response.ok) throw new Error('Ошибка при загрузке тегов');

        const data = await response.json();

        this.dressCodeOptions = data.dressCodes; 
        this.cuisineOptions = data.cuisines;
        this.tagOptions = data.tags;

      } catch (error) {
        console.error(error);
      }
    },

  removeTag(index, field) {
    this.restaurantData[field].splice(index, 1);
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
          
  convertLayout(layoutByFloors) {
    if (!Array.isArray(layoutByFloors)) return [];

    const GRID_WIDTH = 12;
    const ITEMS_PER_FLOOR = 120;

    const result = layoutByFloors.map((floorItems, floorIndex) => {
      if (!Array.isArray(floorItems)) return [];

      let tableIdCounter = 1;
      const floorNumber = floorIndex + 1;

      return floorItems.reduce((acc, item, itemIndex) => {
        if (!item || typeof item !== 'object') return acc;

        const typeId = item.id || item.typeId || 0;
        if (typeId === 0) return acc;

        const x = itemIndex % GRID_WIDTH;
        const y = Math.floor(itemIndex / GRID_WIDTH);

        const isTable = typeId >= 6 && typeId <= 9;
        const id = isTable ? tableIdCounter++ : 0;

        acc.push({
          x,
          y,
          typeId,
          id,
          rotation: item.rotation || 0,
          floor: floorNumber
        });

        return acc;
      }, []);
    });

    return result.flat(); 
  },

    async createRestaurant() {
      this.errorMessage = '';
      this.successMessage = '';

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // ✅ Разделение адреса
      if (this.restaurantData.address) {
        const parts = this.restaurantData.address.split(',').map(p => p.trim());
        this.restaurantData.region = parts[0] || '';
        this.restaurantData.city = parts[1] || '';
        this.restaurantData.street = parts.slice(2).join(', ') || '';
        delete this.restaurantData.address;
      }

      // ✅ Менеджеры → moderatorEmails
      if (Array.isArray(this.restaurantData.managers)) {
        this.restaurantData.moderatorEmails = this.restaurantData.managers.map(m => m.email);
        delete this.restaurantData.managers;
      }

      // ✅ Преобразование блюд
      if (Array.isArray(this.restaurantData.dishes)) {
        this.restaurantData.dishes = this.restaurantData.dishes.map(dish => {
          const { id, photo, image, ...rest } = dish;
          return {
            ...rest,
            photoUrl: image || '',
            name: dish.name || '',
            ingredients: dish.ingredients || '',
            price: Number(dish.price) || 0,
            weight: Number(dish.weight) || 0
          };
        });
      }

      // ✅ Layout
      if (Array.isArray(this.restaurantData.layout)) {
        this.restaurantData.layout = this.convertLayout(this.restaurantData.layout);
      }

      // ✅ Schedule
      if (Array.isArray(this.restaurantData.schedule)) {
        this.restaurantData.schedule = this.restaurantData.schedule.map(day => ({
          day: day.day || '',
          isDayOff: !!day.isClosed || !!day.isDayOff,
          open: (day.isClosed || day.isDayOff) ? '' : (day.open || ''),
          close: (day.isClosed || day.isDayOff) ? '' : (day.close || '')
        }));
      }

      try {
        const payload = {
          Name: this.restaurantData.name,
          Description: this.restaurantData.description,
          City: this.restaurantData.city,
          Region: this.restaurantData.region,
          Street: this.restaurantData.street,
          Layout: this.restaurantData.layout,
          Gallery: this.restaurantData.gallery.filter(img => img),
          Schedule: this.restaurantData.schedule,
          ModeratorEmails: this.restaurantData.moderatorEmails,
          Tags: this.restaurantData.tags.map(t => t.name),           
          Cuisine: this.restaurantData.cuisine.map(c => c.name),     
          DressCode: this.restaurantData.dressCode.map(d => d.name), 
          Dishes: this.restaurantData.dishes                         
        };
        console.log('Отправляемые данные:', payload);

        const response = await fetch('https://backend-restoran.onrender.com/api/Restaurant/Create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let errorText;
          try {
            const errorJson = await response.json();
            errorText = JSON.stringify(errorJson);
          } catch {
            errorText = await response.text();
          }
          throw new Error(`Помилка при створенні ресторану: ${errorText}`);
        }

        this.successMessage = 'Ресторан успішно створено!';
        this.$router.back();

      } catch (error) {
        console.error('Ошибка создания ресторана:', error);
        this.errorMessage = error.message || 'Сталася помилка';
      }
    },

      cancelCreation() {
      localStorage.removeItem('restaurant_dishes');
      localStorage.removeItem('restaurant_workers');
 
      this.restaurantData = {
        name: '',
        description: '',
        photoUrl: null,
        cuisine: [],
        tags: [],
        layout: [Array.from({ length: 120 }, () => null)],
        dishes: [],
        moderatorEmails: [],
        street: '',
        city: '',        
        region: '',        
        email: '',
        organization: '',
        schedule: []    
      };

      this.$router.back();
    },
  }
}
</script>


<style scoped>
.restaurant-info-card {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.photo-form-wrapper,
.restaurant-constructor,
.constructor-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 32px;
  max-width: 1400px;
  margin-inline: auto;
}

/* === Фото-блок === */
.gallery-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  width: 320px;
  height: 320px;
  margin-bottom: 10px;
}

.gallery-frame {
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* или scroll, если хочешь прокрутку */
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; 
}

.photo-placeholder {
  font-size: 16px;
  color: #888;
  text-align: center;
}

.gallery-arrow {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 20px;
  padding: 6px 10px;
  border-radius: 50%;
  cursor: pointer;
}

.gallery-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.gallery-indicators {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
}

.dot.active {
  background: #333;
}

.remove-photo {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 13px;
  cursor: pointer;
}

/* === Левая и правая сторона карточки === */
.restaurant-info-card {
  flex-wrap: wrap;
  gap: 24px;
}
.info-side {
  flex: 1;
  min-width: 300px;
}

/* === Input'ы === */
.name-input,
.description-input {
  width: 100%;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* === Секция dress-кода === */
.dress-code-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
}
.form-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* === Tags === */
.tags-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}
.tag-select-block,
.tag-select {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100px;
}

.tag-select select {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 50l60 60 60-60' fill='none' stroke='%23666' stroke-width='15'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
  cursor: pointer;
  width: 100%;
  transition: border-color 0.2s;
}
.tag-select select:focus {
  outline: none;
  border-color: #FF6F61;
}

.tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  background: #eee;
  color: #333;
  white-space: nowrap;
}
.tag.selected,
.tag.active {
  background-color: #FF6F61;
  color: white;
  font-size: 14px;
  padding: 6px 10px;
}

/* === Scrollable Selected Tags === */
.selected-tags-block {
  flex: 1;
}
.selected-tags-block h4 {
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}
.dress-code-section .selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 31px; 
  overflow-y: auto; 
  padding: 6px;
  background: #fafafa;
  margin-top: 8px;
  white-space: normal; 
  scrollbar-width: thin;
}
.dress-code-section .selected-tags::-webkit-scrollbar {
  height: 6px;
}

.dress-code-section .selected-tags::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 4px;
}

/* === Чекбоксы === */
.checkbox-pair {
  display: flex;
  gap: 16px;
  margin-top: 22px;
}
.option-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #f0f0f0;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.option-checkbox input[type="checkbox"] {
  display: none;
}
.option-checkbox:has(input:checked) {
  background-color: #FF6F61;
  color: white;
}

/* === Адаптив === */
@media (max-width: 768px) {
  .restaurant-info-card,
  .photo-form-wrapper {
    flex-direction: column;
  }
  .photo-side,
  .info-side,
  .photo-block {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
  }
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