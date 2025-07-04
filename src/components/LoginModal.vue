<template>
  <div class="modal-backdrop" v-if="visible" @click="handleBackdropClick" :class="{ 'no-backdrop-animation': transitionOnlyContent }">
    <div class="modal-content" @click.stop>
      <h2 class="title">Вхід</h2>

      <label class="input-label">Електронна пошта</label>
      <input type="email" v-model="email" class="input-field" placeholder="Введіть електронну пошту" />

      <label class="input-label">Пароль</label>
      <div class="password-wrapper">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" class="input-field" placeholder="Введіть пароль" />
        <button class="toggle-password" @click="togglePassword" type="button">
          {{ showPassword ? '🙈' : '👁' }}
        </button>
      </div>

      <div class="remember-me">
        <input type="checkbox" id="remember" v-model="rememberMe" />
        <label for="remember">Запам'ятати мене</label>
      </div>

      <button class="login-button" @click="handleLogin">Увійти</button>

      <GoogleLogin :callback="handleGoogleLogin" />

      <div class="links">
        <span class="link" @click="$emit('forgot')">Забули пароль?</span>
        <span class="link" @click="$emit('register')">Створити обліковий запис</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { GoogleLogin } from 'vue3-google-login'
import { showToast } from '../services/toast.js'



const props = defineProps({
  visible: Boolean,
  transitionOnlyContent: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'forgot', 'register'])

const rememberMe = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

function handleBackdropClick() {
  emit('close')
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
      console.error('Сервер повернув помилку:', data)
      throw new Error(data?.message || 'Невірна електронна пошта або пароль')
    }

    console.log('Успішний вхід:', data)
saveAuthData(data);
window.location.href = '/';

    emit('close')
  } catch (error) {
    console.error('Помилка входу:', error)
    showToast(error.message, 'error')
  }
}

const handleGoogleLogin = async (response) => {
  const googleToken = response.credential;
  console.log("Google token:", googleToken)

  try {
    const result = await axios.post('https://backend-restoran.onrender.com/api/Account/web/google', {
      googleToken: googleToken,
      rememberMe: true
    })

    console.log('Google login result:', result.data)

    saveAuthData(result.data)

    window.location.href = '/'
  } catch (error) {
    console.error('Помилка входу через Google:', error)

showToast('Помилка входу', 'error')
  }
}

function saveAuthData(data) {
  localStorage.setItem('token', data.accessToken)
  localStorage.setItem('userId', data.userId)

  if (data.email) {
    localStorage.setItem('email', data.email)
  }

  localStorage.setItem('isAuthenticated', 'true')
  window.dispatchEvent(new Event('storage'))
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
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
  box-sizing: border-box;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
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
.custom-google-btn {
  margin-top: 16px;
  width: 100%;
  height: 48px;
  border: 1px solid #dadce0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 500;
  font-size: 16px;
  color: #3c4043;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-google-btn:hover {
  background-color: #f7f7f7;
}

.custom-google-btn img {
  width: 22px;
  height: 22px;
}

</style>
