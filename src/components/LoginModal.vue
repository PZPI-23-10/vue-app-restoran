<template>
  <transition name="fade-backdrop" appear>
    <div
      v-if="internalVisible"
      class="modal-backdrop modal-backdrop-active"
      @click="handleBackdropClick"
    >
      <transition name="scale-content" appear>
        <div
          v-if="internalVisible"
          class="modal-content modal-content-active"
          @click.stop
        >
          <h2 class="title">Вхід</h2>

          <label class="input-label">Електронна пошта</label>
          <input
            type="email"
            v-model="email"
            class="input-field"
            placeholder="Введіть електронну пошту"
          />

          <label class="input-label">Пароль</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="input-field"
              placeholder="Введіть пароль"
            />
            <button class="toggle-password" @click="togglePassword" type="button">
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>

          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe" />
            <label for="remember">Запам'ятати мене</label>
          </div>

          <button class="login-button" @click="handleLogin">Увійти</button>
          <button class="google-button" @click="handleGoogleLogin">
            Увійти через Google
          </button>

          <div class="links">
            <span class="link" @click="$emit('forgot')">Забули пароль?</span>
            <span class="link" @click="$emit('register')">Створити обліковий запис</span>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  backdropVisible: Boolean
})


const emit = defineEmits(['close', 'forgot', 'register', 'update:backdropVisible'])

const internalVisible = ref(false)
const rememberMe = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)

watch(() => props.visible, (val) => {
  internalVisible.value = val
  emit('update:backdropVisible', val)
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function handleLogin() {
  try {
    const response = await fetch('https://backend-restoran.onrender.com/api/Account/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const contentType = response.headers.get('content-type')
    let data = {}

    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || 'Помилка при вході')
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Невірна електронна пошта або пароль')
    }

    // Сохраняем авторизационные данные
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('userId', data.userId)
    localStorage.setItem('isAuthenticated', 'true')

    window.dispatchEvent(new Event('storage'))

  internalVisible.value = false;
  setTimeout(() => {
    emit('close');
  }, 300);

  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}

function handleGoogleLogin() {
  const clientId = '71975591740-1ikt0qhpb1g570oogv7pomahcr09hqf8.apps.googleusercontent.com'
  const redirectUri = window.location.origin + '/google-auth-callback'
  const scope = 'email profile openid'
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`
  window.location.href = url
}

function handleBackdropClick() {
  internalVisible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}
</script>

<style scoped>
.google-button {
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background-color: white;
  color: #444;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.google-icon {
  width: 20px;
  height: 20px;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
  box-sizing: border-box;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-backdrop-active {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  max-height: 100%;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-content-active {
  opacity: 1;
  transform: scale(1);
}

.fade-backdrop-enter-active,
.fade-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.fade-backdrop-enter-from,
.fade-backdrop-leave-to {
  opacity: 0;
}
.fade-backdrop-enter-to,
.fade-backdrop-leave-from {
  opacity: 1;
}

.scale-content-enter-active,
.scale-content-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.scale-content-enter-from,
.scale-content-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.scale-content-enter-to,
.scale-content-leave-from {
  opacity: 1;
  transform: scale(1);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 4px;
}

.no-backdrop-animation {
  animation: none !important;
}

.title {
  text-align: center;
  margin-bottom: 16px;
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

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 14px;
  color: #333;
}
.remember-me input {
  accent-color: #FF6F61;
  width: 16px;
  height: 16px;
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
  margin-top: 16px;
}

.link {
  text-decoration: underline;
  color: #007bff;
  cursor: pointer;
  font-size: 15px;
}
</style>