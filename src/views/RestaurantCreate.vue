<template>
  <div class="restaurant-constructor">
    <div class="first-section">
      <div class="photo-block" @click="triggerFileInput">
        <input type="file" ref="fileInput" hidden @change="handleFileChange" />
          <div class="photo-placeholder" v-if="!previewImage">+ Додати фото</div>
           <img v-else :src="previewImage" class="preview-image" />
      </div>

      <div class="form-block">
        <input class="name-input" type="text" placeholder="Назва ресторану" />
        <textarea class="description-input" placeholder="Опис"></textarea>

      <div class="tags-wrapper">
        <div class="tag-select">
            <label>Кухня</label>
            <select @change="addTag($event, 'cuisine')">
              <option value="">Оберіть кухню</option>
              <option v-for="c in cuisineOptions" :key="c" :value="c">{{ c }}</option>
            </select>
            <div class="selected-tags">
              <span 
                v-for="(tag, index) in selectedCuisine" 
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
                v-for="(tag, index) in selectedTags" 
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
      <button>Додати страву</button>
      <button>Встановити робочі години</button>
      <button>Зареєструвати модераторів</button>
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
              @dragstart="onDragStart(el)"
            >
              <img :src="el.image" class="element-img" />
              <span>{{ el.title }}</span>
            </div>
          </div>
        </div>

        <div class="restaurant-area">
          <h3>Поле ресторану</h3>
         <div class="restaurant-grid">
          <div 
            v-for="(cell, index) in 96" 
            :key="index" 
            class="grid-cell" 
            @dragover.prevent 
            @drop="onDrop(index)"
            @click="handleCellClick(index)"
          >
            <div v-if="gridElements[index]" class="grid-item">
              <img 
                :src="gridElements[index].image" 
                class="placed-element"
                :style="{ transform: 'rotate(' + (gridElements[index].rotation || 0) + 'deg)' }"
              />
            </div>
          </div>       
        </div>
        <div class="mode-toggle">
          <label>
            <input type="radio" value="edit" v-model="mode" />
            Редагування
          </label>
          <label>
            <input type="radio" value="delete" v-model="mode" />
            Видалення
          </label>
        </div>
          <div class="elements-bottom">
            <h3>Конструктор</h3>
            <div class="elements-horizontal">
            <div 
              class="element-btn-horizontal" 
              v-for="el in bottomElements" 
              :key="el.id"
              draggable="true"
              @dragstart="onDragStart(el)"
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
      <button class="publish-btn">Опублікувати</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RestaurantCreate',
  data() {
    return {
      mode: 'edit',
      cuisineOptions: ['Італійська кухня', 'Українська кухня'],
      tagOptions: ['Романтика', 'Сімейне', 'Ділові зустрічі'],
      selectedCuisine: [],
      selectedTags: [],
      previewImage: null,
      draggedElement: null,
      gridElements: Array(96).fill(null),
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
        { id: 10, title: 'Освітлення', image: '/images/ligthSource.png' },
        { id: 11, title: 'Сходи', image: '/images/stairs.png' }
      ]
    }
  },
  methods: {
    triggerFileInput() {
    this.$refs.fileInput.click();
    },
    
    addTag(event, type) {
      const value = event.target.value;
      if (!value) return;

      if (type === 'cuisine' && !this.selectedCuisine.includes(value)) {
        this.selectedCuisine.push(value);
      }
      if (type === 'tags' && !this.selectedTags.includes(value)) {
        this.selectedTags.push(value);
      }

      event.target.selectedIndex = 0;
    },
    onDragStart(el) {
    this.draggedElement = el;
    console.log('STARTED DRAGGING:', el);
    },
    rotateElement(index) {
      const element = this.gridElements[index];
      if (element) {
        const newRotation = (element.rotation || 0) + 90;
        this.$set(this.gridElements, index, {
          ...element,
          rotation: newRotation % 360,
        });
      }
    },
    removeElement(index) {
      this.$set(this.gridElements, index, null);
    },
    onDrop(index) {
      if (this.draggedElement) {
        this.gridElements[index] = { ...this.draggedElement };
        if (this.draggedElement.fromIndex !== null) {
          this.gridElements[this.draggedElement.fromIndex] = null;
        }
        this.draggedElement = null;
      }
    },
    onDragStart(element, index = null) {
      this.draggedElement = { ...element, fromIndex: index };
    },
    handleCellClick(index) {
      const element = this.gridElements[index];
      if (!element) return;

      if (this.mode === 'delete') {
        this.$set(this.gridElements, index, null);
      } else if (this.mode === 'edit') {
        const newRotation = (element.rotation || 0) + 90;
        this.$set(this.gridElements, index, {
          ...element,
          rotation: newRotation % 360
        });
      }
    },
    handleFileChange(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    },
    removeTag(index, type) {
      if (type === 'cuisine') this.selectedCuisine.splice(index, 1);
      if (type === 'tags') this.selectedTags.splice(index, 1);
    }
  }
};

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
  height: 504px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 1px;
  border: 2px solid #aaa;
  background: #e0e0e0;
  border-radius: 8px;
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

.publish-btn:hover {
  background-color: #e55a4c;
}
</style>