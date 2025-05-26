<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="visible" @click.self="$emit('close')">
      <div class="modal-window">
        <div class="modal-header">
          <h2>Менеджери</h2>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>

        <div class="managers-container">
          <div v-if="managers.length === 0" class="empty-message">
            Список менеджерів порожній.
          </div>

          <div v-for="manager in managers" :key="manager.id" class="manager-item">
            <div class="manager-info">
              <p><strong>Email:</strong> {{ manager.email }}</p>
            </div>
            <div class="manager-actions">
              <button @click="$emit('edit', manager)" class="edit-btn">Редагувати</button>
              <button @click="$emit('delete', manager.id)" class="delete-btn">Видалити</button>
            </div>
          </div>
        </div>

        <div class="add-dish-footer">
          <button class="add-btn" @click="$emit('add')">+ Додати менеджерів</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    managers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    localManagers() {
      return this.managers || [];
    }
  },
  methods: {
    deleteManager(id) {
      this.$emit('delete', id);
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-window {
  background: white;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  overflow-y: auto;
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

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.managers-container {
  padding: 20px;
  flex-grow: 1;
}

.manager-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.manager-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #444;
}

.manager-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: background 0.2s;
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

.add-btn {
  background: #e2874a;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #d47739;
}

.empty-message {
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 40px 0;
}
</style>