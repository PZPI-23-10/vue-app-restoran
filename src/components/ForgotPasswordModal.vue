<template>
  <div class="modal-backdrop" v-if="visible" @click="handleBackdropClick">
    <div class="modal-content" @click.stop>
      <h2 class="title">Відновлення паролю</h2>

      <label class="input-label">Електронна пошта</label>
      <input
        type="email"
        v-model="email"
        class="input-field"
        placeholder="Введіть електронну пошту"
      />

      <button class="login-button" @click="handleResetPassword">Відновити пароль</button>

      <div class="links">
        <span class="link" @click="$emit('back')">Назад до входу</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'back'])

const email = ref('')

function handleResetPassword() {
  console.log('Відновлення паролю на', email.value)
}

function handleBackdropClick() {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  padding: 28px;
  border-radius: 12px;
  width: 340px;
  max-width: 90%;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
  animation: fadeInContent 0.4s ease-out;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
}

.input-label {
  display: block;
  margin-top: 16px;
  margin-bottom: 6px;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
}

.login-button {
  margin-top: 24px;
  width: 100%;
  height: 44px;
  background-color: #FF6F61;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  margin-top: 20px;
}

.link {
  text-decoration: underline;
  color: #007bff;
  cursor: pointer;
  font-size: 15px;
}

/* Optional: simple content fade animation */
@keyframes fadeInContent {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
