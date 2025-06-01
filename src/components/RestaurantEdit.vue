<template>
<div class="modal-overlay">
<div class="modal-window">
  <div class="restaurant-constructor">
    <div class="first-section">
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
              v-if="restaurantData.gallery && restaurantData.gallery[activeIndex]"
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
          v-if="restaurantData && restaurantData.gallery && restaurantData.gallery[activeIndex]"
            class="remove-photo"
            @click="removePhoto(activeIndex)"
          >
            ✕ Удалити фото
          </button>
        </div>
      </div>

      <div class="form-block">
        <input
          class="name-input"
          type="text"
          placeholder="Назва ресторану"
          v-model="restaurantData.name"
        />
        <textarea
          class="description-input"
          placeholder="Опис"
          v-model="restaurantData.description"
        ></textarea>

        <div class="dress-code-section">
          <div class="dress-code-row">
            <div class="tag-select">
          <label>Дресс-код</label>
          <select @change="addTag($event, 'dressCode')" v-model="selectedDressCodeId">
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
        </div>

        <div class="tags-wrapper">
          <div class="tag-select">
              <label>Кухня</label>
              <select @change="addTag($event, 'cuisine')" v-model="selectedCuisineId">
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
            <select @change="addTag($event, 'tags')" v-model="selectedTagId">
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

    <!-- Редактор ресторану -->
    <div class="restaurant-editor">
      <div class="middle-buttons">
        <button @click="activeForm = 'dishes'">🍽️ Редагувати страви</button>
        <button @click="activeForm = 'hours'">Редагувати графік роботи</button>
        <button @click="activeForm = 'managers'">Редагувати менеджерів👨‍🍳</button>
        <button @click="openExtraEditSettings">✏️ Редагувати додаткові дані</button>
      </div>

      <!-- Список страв -->
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

      <!-- Список менеджерів -->
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

      <!-- Форма блюда -->
      <transition name="fade-scale">
        <AddDish
          v-if="activeForm === 'dish'"
          :visible="true"
          :dishData="dishData"
          @add-dish="handleAddDish"
          @update-dish="handleDishUpdate"
          @close="closeForm"
          @show-dishes="activeForm = 'dishes'"
        />
      </transition>

      <!-- Форма менеджера -->
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

      <!-- Графік роботи -->
      <transition name="fade-slide">
        <AddWorkHours
          v-if="activeForm === 'hours'"
          :visible="true"
          :schedule="restaurantSchedule"
          @close="closeForm"
          @save="handleScheduleSave"
        />
      </transition>
      
      <transition name="fade-slide">
        <ExtraEditSettings
          v-if="activeForm === 'extraEditSettings'"
          :initialData="restaurant"
          @close="closeForm"
          @save="handleSaveExtraSettings"
        />
      </transition>
    </div>

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

    <!-- Кнопки дій -->
    <div class="action-buttons">
      <button class="cancel-btn" @click="cancelEdit">Скасувати</button>
      <button class="publish-btn" @click="updateRestaurant">💾 Зберегти зміни</button>
    </div>
  </div>
  </div>
</div>

</template>


<script>
import DishesList from '../components/DishesList.vue';
import ManagersList from '../components/ManagersList.vue';
import AddDish from '../components/AddDish.vue';
import AddWorkHours from '../components/AddWorkHours.vue';
import AddManager from '../components/AddManager.vue';
import ExtraEditSettings from './ExtraEditSettings.vue';

export default {
  name: "RestaurantEdit",
  components: {
    DishesList,
    ManagersList,
    AddDish,
    AddManager,
    AddWorkHours,
    ExtraEditSettings
  },
  computed: {
  gridElements() {
    if (!this.restaurantData || !this.restaurantData.layout) return null;
    return this.restaurantData.layout[this.activeFloorIndex];
  },
  dishData() {
    return this.prepareDishData(this.selectedDish);
  },
  restaurantSchedule() {
    return this.restaurantData && this.restaurantData.schedule 
      ? [...this.restaurantData.schedule] 
      : [];
  },
    currentPhoto() {
    return this.restaurantData.gallery && this.restaurantData.gallery.length > 0
      ? this.restaurantData.gallery[this.activeIndex]
      : null;
  },
},
  props: {
    restaurant: {
        type: Object,
        required: true
    },
  },
  data() {
    return {
    dishes: [],      
    schedule: [],
    moderators: [],
    restaurantRaw: null,
    restaurantData: null,
    activeFloorIndex: 0,
    activeIndex: 0,
    maxSlots: 4,
    interactionMode: 'default',
    draggedElement: null,
    activeForm: null,
    selectedDish: null,
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
      selectedCuisineId: '',
      selectedTagId: '',
      selectedDressCodeId: '',
      cuisineOptions: [],
      tagOptions: [],
      dressCodeOptions: [],
    };
  },
  created() {
    this.someInitMethod();

    const savedSchedule = localStorage.getItem('restaurant_schedule');
    if (savedSchedule) {
      const parsed = JSON.parse(savedSchedule);
      this.restaurantData.schedule = parsed;
      this.schedule = parsed;
    }
  },

  mounted() {
    this.fetchModeratorEmails();
    this.fetchOptions();
    this.syncGalleryFromPhotos(); 
  },

  watch: {
    restaurant: {
      immediate: true,
      handler(newVal) {
        this.prepareLayout();
        this.prepareDataLists();

        this.restaurantData = { ...newVal };

        // Проверяем и копируем массивы
        this.dishes = this.restaurantData.dishes ? [...this.restaurantData.dishes] : [];
        this.tags = this.restaurantData.tags ? [...this.restaurantData.tags] : [];
        this.schedule = this.restaurantData.schedule ? [...this.restaurantData.schedule] : [];
        this.moderatorEmails = this.restaurantData.moderatorEmails ? [...this.restaurantData.moderatorEmails] : [];
      }
    }
  },

  methods: {
    someInitMethod() {
      this.restaurantData = { ...this.restaurant };
      this.prepareLayout();
      this.prepareDataLists();
    },

    prepareDishData(dish) {
      if (!dish) return null;
      return {
        ...dish,
        name: dish.name || dish.title || '',  
        image: dish.photoUrl || dish.image || '', 
        tags: Array.isArray(dish.tags)
          ? dish.tags.map(t => t.tag?.name || t.name || t)
          : [],
      };
    },

    prepareDataLists() {
      if (!this.restaurant) return;

      this.restaurantData.cuisine = (this.restaurant.cuisines || [])
        .map(c => c.cuisine) 
        .filter(Boolean); 

      this.restaurantData.tags = (this.restaurant.tags || [])
        .filter(t => t.tag && t.tag.name)
        .map(t => ({ id: t.id, name: t.tag.name }));

      this.restaurantData.dishes = (this.restaurant.dishes || []).map(dish => ({
        ...dish,
        tags: (dish.tags || []).map(t => t.tag?.name).filter(Boolean),
        photoUrl: dish.photoUrl || ''
      }));

      this.restaurantData.schedule = this.restaurant.schedule || [];
    },

    syncGalleryFromPhotos() {
      if ((!this.restaurantData.gallery || this.restaurantData.gallery.length === 0) && this.restaurantData.photos) {
        const gallery = Array(this.maxSlots).fill(null);
        this.restaurantData.photos.forEach((photo, index) => {
          if (index < this.maxSlots) {
            gallery[index] = photo.url; 
          }
        });
        this.restaurantData.gallery = gallery;
      }
    },

    prepareLayout() {
      if (!this.restaurant) return;

      if (!this.restaurant || !this.restaurant.layout) {
        this.restaurantData = { ...this.restaurant, layout: [Array(120).fill(null)] };
        return;
      }

      let parsedLayout;

      try {
        if (typeof this.restaurant.layout === 'string') {
          parsedLayout = JSON.parse(this.restaurant.layout);
        } else {
          parsedLayout = this.restaurant.layout;
        }
      } catch(e) {
        console.error('Ошибка парсинга layout:', e);
        parsedLayout = [];
      }

      if (Array.isArray(parsedLayout) && parsedLayout.length && typeof parsedLayout[0] === 'object' && 'Floor' in parsedLayout[0]) {
        // сгруппируем объекты по этажам
        const floorsMap = new Map();
        parsedLayout.forEach(item => {
          if (!floorsMap.has(item.Floor)) floorsMap.set(item.Floor, []);
          floorsMap.get(item.Floor).push(item);
        });
        // Получаем массив этажей с объектами
        const floorsArray = Array.from(floorsMap.values());
        this.restaurantData = {
          ...this.restaurant,
          layout: floorsArray.map(floorData => this.convertLayoutToGrid(floorData))
        };
      } else if (Array.isArray(parsedLayout)) {
        // если просто массив этажей
        this.restaurantData = {
          ...this.restaurant,
          layout: parsedLayout.map(floorData => this.convertLayoutToGrid(floorData))
        };
      } else {
        this.restaurantData = {
          ...this.restaurant,
          layout: [Array(120).fill(null)]
        };
      }

      this.activeFloorIndex = 0;
  },

  convertLayoutToGrid(layoutArray) {
    const grid = new Array(120).fill(null);
    layoutArray.forEach(item => {
      const index = item.Y * 12 + item.X;  // Внимание на регистр — у тебя с большой буквы X и Y
      const element = this.getElementByTypeId(item.TypeId);
      grid[index] = {
        id: item.Id,
        typeId: item.TypeId,
        image: element?.image || '',
        rotation: item.Rotation,
        floor: item.Floor
      };
    });
    return grid;
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

    convertLayout(layoutByFloors) {
      if (!Array.isArray(layoutByFloors)) return [];

      const GRID_WIDTH = 12;

      const userTypeMapping = {
        "Пряма стіна": 1,
        "Окружність": 2,
        "Стіна \"Трикутник\"": 3,
        "Двері": 4,
        "Вікна": 5,
        "Місце на двох": 6,
        "Місце на багатьох": 7,
        "Столи з диваном/кріслом": 8,
        "Барна стійка": 9,
        "Сходи": 10
      };

      const result = layoutByFloors.map((floorItems, floorIndex) => {
        if (!Array.isArray(floorItems)) return [];

        let tableIdCounter = 1;
        const floorNumber = floorIndex + 1;

        return floorItems.reduce((acc, item, itemIndex) => {
          if (!item || typeof item !== 'object') return acc;

          // Определяем typeId
          let typeId = 0;

          if (item.typeId !== undefined) {
            typeId = item.typeId;
          } else if (item.title && userTypeMapping[item.title]) {
            typeId = userTypeMapping[item.title];
          } else if (item.id !== undefined && item.id !== 0) {
            // Если есть id, но нет typeId и title — можно задать дефолт или игнорировать
            typeId = 1; // например, дефолт стенка
          }

          if (typeId === 0) return acc; // пропускаем пустые/неопределённые

          // Определяем floor
          const floor = item.floor !== undefined ? item.floor : floorNumber;

          const x = itemIndex % GRID_WIDTH;
          const y = Math.floor(itemIndex / GRID_WIDTH);

          // Проверяем, если это стол (typeId 6..9), то задаём уникальный id
          const isTable = typeId >= 6 && typeId <= 9;
          const id = isTable ? tableIdCounter++ : 0;

          acc.push({
            x,
            y,
            typeId,
            id,
            rotation: item.rotation || 0,
            floor
          });

          return acc;
        }, []);
      });

      return result.flat();
    },
    
    getElementByTypeId(typeId) {
        const allElements = [...this.leftElements, ...this.bottomElements];
        return allElements.find(el => el.id === typeId);
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.restaurantData.photoUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    addTag(event, type) {
      let selectedId = '';
      let optionsArray = [];

      if (type === 'cuisine') {
        selectedId = this.selectedCuisineId;
        optionsArray = this.cuisineOptions;
      } else if (type === 'tags') {
        selectedId = this.selectedTagId;
        optionsArray = this.tagOptions;
      } else if (type === 'dressCode') {
        selectedId = this.selectedDressCodeId;
        optionsArray = this.dressCodeOptions;
      }

      if (!selectedId) return;

      const item = optionsArray.find(opt => opt.id === selectedId);
      if (!item) return;

      if (!this.restaurantData[type]) {
        this.restaurantData[type] = [];
      }

      // Проверяем дубликаты по id
      if (!this.restaurantData[type].some(t => t.id === selectedId)) {
        this.restaurantData[type].push(item);
      }

      // Сброс выбранного id
      if (type === 'cuisine') this.selectedCuisineId = '';
      else if (type === 'tags') this.selectedTagId = '';
      else if (type === 'dressCode') this.selectedDressCodeId = '';
    },
    
    removeTag(index, type) {
      this.restaurantData[type].splice(index, 1);
    },

    async fetchModeratorEmails() {
    const promises = this.moderatorsRaw.map(async (mod) => {
      try {
        const res = await fetch(`https://backend-restoran.onrender.com/api/Account/${mod.userId}`);
        if (!res.ok) throw new Error('Ошибка запроса');
        const userData = await res.json();
        return { ...mod, email: userData.email }; 
      } catch (e) {
        console.error('Ошибка загрузки пользователя:', e);
        return { ...mod, email: null };
      }
    });
    this.moderators = await Promise.all(promises);
  },


    async fetchOptions() {
      try {
        const response = await fetch('https://backend-restoran.onrender.com/api/Tag');
        if (!response.ok) throw new Error('Ошибка при загрузке тегов');

        const data = await response.json();

        // сохраняем опции с id и name
        this.dressCodeOptions = data.dressCodes.map(d => ({ id: d.id, name: d.name }));
        this.cuisineOptions = data.cuisines.map(c => ({ id: c.id, name: c.name }));
        this.tagOptions = data.tags.map(t => ({ id: t.id, name: t.name }));

      } catch (error) {
        console.error(error);
      }
    },

    cancelEdit() {
      this.$emit("close"); 
    },

    async updateRestaurant() {
      try {
        const token = localStorage.getItem('token');

  //  console.log('Исходный grid (layout):', this.restaurantData.layout);
      const layout = this.convertLayout(this.restaurantData.layout);
      console.log('Результат convertGridToLayout:', layout);

        const moderatorEmails = this.restaurantData.managers?.map(m => m.email) || [];

        const cuisine = this.restaurantData.cuisine?.map(c => c.name) || [];

        // 4. Подготовить корректный payload
        const requestPayload = {
          request: {
            RestaurantId: this.restaurantData.id,
            Name: this.restaurantData.name,
            Description: this.restaurantData.description,
            City: this.restaurantData.city,
            Region: this.restaurantData.region,
            Street: this.restaurantData.street,
            Email: this.restaurantData.email,
            PhotoUrl: this.restaurantData.photoUrl,
            Organization: this.restaurantData.organization,
            Latitude: this.restaurantData.latitude,
            Longitude: this.restaurantData.longitude,
            Cuisine: cuisine,
            Tags: this.restaurantData.tags || [],
            ModeratorEmails: moderatorEmails,
            Dishes: this.restaurantData.dishes || [],
            Layout: layout,
            Schedule: this.restaurantData.schedule || []
          }
        };

        console.log('Финальные данные:', requestPayload);

        // 5. Отправить запрос
        const response = await fetch('https://backend-restoran.onrender.com/api/Restaurant/Editing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestPayload),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error('Ошибка от сервера:', result);
          return;
        }

        this.$emit('updated', this.restaurantData);
      } catch (err) {
        console.error('Ошибка при сохранении:', err);
      }
    },
    
    handleSaveExtraSettings(updatedData) {
      console.log("Получены данные:", updatedData);

      // Явно обновляем поля по одному:
      this.restaurant.city = updatedData.city;
      this.restaurant.region = updatedData.region;
      this.restaurant.street = updatedData.street;
      this.restaurant.email = updatedData.email;
      this.restaurant.organization = updatedData.organization;

      this.closeForm();
    },

    closeForm() {
      this.activeForm = null;
      this.selectedDish = null;
    },
    openEditDish(dish) {
      this.selectedDish = dish; 
      this.activeForm = 'dish';
    },
    openExtraEditSettings() {
      this.activeForm = 'extraEditSettings';
    },
    openAddDish() {
      this.selectedDish = null;
      this.activeForm = 'dish';
    },
    handleDeleteDish(dishId) {
      this.dishes = this.dishes.filter(d => d.id !== dishId);
    },
    openAddManager() {
      this.currentItem = null;
      this.activeForm = 'manager';
    },
    openEditManager(manager) {
      this.currentItem = manager;
      this.activeForm = 'manager';
    },
    handleDeleteManager(managerId) {
      this.restaurantData.managers = this.restaurantData.managers.filter(m => m.id !== managerId);
    },

    handleFormSubmit(updatedManager) {
      if (!this.restaurantData.managers) {
        this.restaurantData.managers = [];
      }

      const index = this.restaurantData.managers.findIndex(
        m => m.id === updatedManager.id
      );

      if (index !== -1) {
        // Обновление существующего
        this.restaurantData.managers[index] = {
          ...this.restaurantData.managers[index],
          ...updatedManager
        };
      } else {
        // Добавление нового — с уникальным id
        this.restaurantData.managers.push({
          ...updatedManager,
          id: Date.now() // или другой способ сгенерировать id
        });
      }

      this.closeForm();
    },
    
    handleAddDish(newDish) {
      this.dishes.push(newDish);
      this.restaurantData.dishes = [...this.dishes];
      this.activeForm = 'dishes';
      this.currentItem = null;
    },

    handleDishUpdate(updatedDish) {
      const index = this.dishes.findIndex(d => d.id === updatedDish.id);
      if (index !== -1) {
        this.dishes.splice(index, 1, updatedDish);
        this.restaurantData.dishes = [...this.dishes];
      }
      this.activeForm = 'dishes';
      this.currentItem = null;
    },

    handleScheduleSave(newSchedule) {
      this.restaurantData.schedule = newSchedule;
      this.schedule = [...newSchedule]; 

      localStorage.setItem('restaurant_schedule', JSON.stringify(newSchedule));

      this.closeForm();
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

    // Начало перетаскивания с панели (слева или снизу)
    onDragStart(el, event) {
        this.draggedElement = { item: el };
        this.rotationDuringDrag = 0;
        this.previewX = event.clientX;
        this.previewY = event.clientY;
    },

    // Начало перетаскивания уже размещённого элемента на сетке
    onGridItemDragStart(index) {
        this.draggedElement = {
        item: JSON.parse(JSON.stringify(this.gridElements[index])),
        index,
        };
    },

    // Сброс на сетку
    onDrop(index) {
        if (!this.draggedElement || !this.draggedElement.item) return;

        if (typeof this.draggedElement.index === 'number') {
            this.gridElements[this.draggedElement.index] = null;
        }

        this.gridElements[index] = {
            ...this.draggedElement.item,
            rotation: this.rotationDuringDrag || 0,
        };

        this.draggedElement = null;
    },

    setInteractionMode(mode) {
        this.interactionMode = mode;
    },

    // Обработка клика по элементу в сетке
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
        const current = this.gridElements[index];
        if (current) {
            const newRotation = ((current.rotation || 0) + 90) % 360;
            this.gridElements[index] = {
                ...current,
                rotation: newRotation,
            };
        }
    },

    removeElement(index) {
        this.gridElements[index] = null;
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-window {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

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
  flex-direction: column;
  gap: 8px;
  max-height: 50px; /* Увеличил для лучшего отображения */
  overflow-y: auto;
  padding-right: 8px;
  margin-top: 6px;
  width: 100%;
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

.dress-code-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 8px;
  margin-top: 6px;
  width: 100%;
}
.dress-code-section .selected-tags::-webkit-scrollbar {
  width: 6px;
}

.selected-tags::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.selected-tags::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 4px;
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
.tag.selected {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #FF6F61;
  color: white;
  font-size: 13px;
  width: fit-content;
  cursor: pointer;
  margin-right: 0; /* Убрал горизонтальный отступ */
  margin-bottom: 4px; /* Добавил вертикальный отступ */
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