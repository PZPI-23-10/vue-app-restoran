<template>
  <transition name="modal">
    <div class="modal-overlay" v-if="visible">
      <div class="modal-window">
        <div class="modal-header">
          <h2>Меню ресторану</h2>
          <div class="header-actions">
            <button 
              v-if="dishes.length > 4"
              @click="$emit('add-dish')" 
              class="header-add-btn"
            >
              + Додати
            </button>
            <button @click="$emit('close')" class="close-btn">×</button>
          </div>
        </div>

        <div v-if="dishes.length === 0" class="empty-message">
          <p>Меню порожнє. Додайте першу страву!</p>
          <button @click="$emit('add-dish')" class="add-btn">
            + Додати страву
          </button>
        </div>

        <div class="dishes-container">
          <div v-for="dish in dishes" :key="dish.id" class="dish-card">
            <div class="dish-image">
              <img v-if="dish.image || dish.photoUrl" :src="dish.image || dish.photoUrl" alt="Фото страви" />
              <div v-else class="image-placeholder">Немає фото</div>
            </div>
            <div class="dish-info">
              <h3>{{ dish.name || dish.title }}</h3>
              <div class="dish-details">
                <span>{{ dish.price }} грн</span>
                <span>•</span>
                <span>{{ dish.weight }} г</span>
              </div>
              <p class="ingredients">{{ dish.ingredients }}</p>
            </div>
            
            <div class="dish-actions">
              <button @click="$emit('edit-dish', dish)" class="edit-btn">
                Редагувати
              </button>
              <button @click="confirmDelete(dish.id)" class="delete-btn">
                Видалити
              </button>
            </div>
          </div>
        </div>

        <div class="add-dish-footer" v-if="dishes.length > 0">
          <button @click="$emit('add-dish')" class="add-btn">
            + Додати страву
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    dishes: {  
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dishesList: []
    };
  },
  created() {
    this.loadDishes();
  },
  methods: {
    loadDishes() {
      try {
        const saved = localStorage.getItem('restaurant_dishes');
        this.dishesList = saved ? JSON.parse(saved) : [...this.dishes];
      } catch (e) {
        console.error('Помилка завантаження страв:', e);
        this.dishesList = [...this.dishes];
      }
    },
    confirmDelete(dishId) {
      if (confirm('Точно видалити цю страву?')) {
        this.$emit('delete-dish', dishId);
      }
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadDishes();
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-window {
  background: white;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
}

.dish-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 4px;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-add-btn {
  background: #FF9C2B;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.header-add-btn:hover {
  background: #e68922;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.empty-message {
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.empty-message p {
  margin-bottom: 20px;
}

.add-btn {
  background: #FF9C2B;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #e68922;
}

.dishes-container {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.dish-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
}

.dish-card:hover {
  background: #f9f9f9;
}

.dish-info {
  flex-grow: 1;
  min-width: 0;
}

.dish-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-details {
  display: flex;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.ingredients {
  color: #888;
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-actions {
  display: flex;
  gap: 10px;
  margin-left: 20px;
  flex-shrink: 0;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.edit-btn {
  background: #4CAF50;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.edit-btn:hover {
  background: #3e8e41;
}

.delete-btn:hover {
  background: #d32f2f;
}

.add-dish-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>