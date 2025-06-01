<template>
  <transition name="modal-scale">  
    <div class="modal-overlay" v-if="visible" @click.self="close">
      <div class="modal-window">
        <div class="add-worker-form">
          <h2>Додавання модератора</h2>

          <div class="input-field">
            <label>Пошта</label>
            <input v-model="worker.email" type="email" required />
          </div>

          <div class="actions">
            <button class="cancel" @click="close">Скасувати</button>
            <button 
              class="submit" 
              @click="submitForm"
              :disabled="!isFormValid"
            >
              {{ isEditMode ? 'Оновити' : 'Додати модератора' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  workerData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit', 'show-managers']);

const worker = ref({
  email: '',
});

const isEditMode = computed(() => !!props.workerData);

const isFormValid = computed(() =>
  worker.value.email.trim() !== '' 
);

const close = () => {
  emit('close');
  emit('show-managers');
};

const submitForm = () => {
  if (!isFormValid.value) return;

  const trimmedEmail = worker.value.email.trim();

  const dataToSend = {
    email: trimmedEmail
  };

  if (props.workerData && props.workerData.id !== undefined) {
    dataToSend.id = props.workerData.id; // сохранить id при редактировании
  }

  emit('submit', dataToSend);
  worker.value = { email: '' };
  close();
};

watch(
  () => props.workerData,
  (newVal) => {
    if (newVal && newVal.email) {
      worker.value = { email: newVal.email.trim() };
    } else {
      worker.value = { email: '' };
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.35s cubic-bezier(0.36, 0.66, 0.04, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
}

.modal-scale-enter-active .modal-window,
.modal-scale-leave-active .modal-window {
  transition: all 0.35s cubic-bezier(0.36, 0.66, 0.04, 1);
}

.modal-scale-enter-from .modal-window {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-scale-enter-to .modal-window {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.modal-scale-leave-to .modal-window {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-window {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.add-worker-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #555;
}

input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: all 0.2s;
}

input:focus {
  border-color: #e24a4a;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  outline: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

button.submit {
  background-color: #ff6b6b;
  color: white;
}

button.submit:hover {
  background-color: #c93c3c;
}

button.cancel {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

button.cancel:hover {
  background-color: #f5f5f5;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-window,
.modal-leave-active .modal-window {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .modal-window,
.modal-leave-to .modal-window {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>