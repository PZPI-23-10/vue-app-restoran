<template>
  <transition name="modal">
    <div class="modal-overlay" v-if="visible" @click.self="$emit('close')">
      <div class="modal-window">
        <h2>Модератори</h2>
        <div class="managers-container">
          <div v-for="manager in managers" :key="manager.id" class="manager-item">
            <div class="manager-info">
              <h3>{{ manager.name }}</h3>
              <p>{{ manager.phone }}</p>
            </div>
            <div class="manager-actions">
              <button @click="$emit('edit-manager', manager)">Редагувати</button>
              <button @click="deleteManager(manager.id)">Видалити</button>
            </div>
          </div>
        </div>
        <button @click="$emit('close')">Закрити</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['visible'],
  data() {
    return {
        managers: []
    }
  },
  created() {
    try {
        const saved = localStorage.getItem('restaurant_workers');
        this.managers = saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Ошибка загрузки работников:', e);
        this.managers = [];
    }
  },
  methods: {
    deleteManager(id) {
      this.managers = this.managers.filter(m => m.id !== id);
      localStorage.setItem('restaurant_workers', JSON.stringify(this.managers));
    }
  }
}
</script>