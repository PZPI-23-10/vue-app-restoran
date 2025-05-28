<template>
  <div class="overlay">
    <div class="modal">
      <h3>{{ title }}</h3>
      <p v-if="message">{{ message }}</p>
      <div class="actions">
        <button class="confirm-btn" @click="$emit('confirm')">{{ confirmText }}</button>
        <button class="cancel-btn" @click="$emit('close')">{{ cancelText }}</button>
     </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmCloseModal',
  props: {
    title: {
      type: String,
      default: 'Ви впевнені?'
    },
    message: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Підтвердити'
    },
    cancelText: {
      type: String,
      default: 'Скасувати'
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
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

.confirm-btn {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #FF6F61;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.confirm-btn:hover {
  background-color: #e55a4c;
}
</style>
