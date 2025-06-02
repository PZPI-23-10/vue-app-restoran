<template>
  <div
    class="modal-backdrop"
    v-if="visible"
    @click="handleBackdropClick"
    :class="{ 'no-backdrop-animation': transitionOnlyContent }"
  >
    <div class="modal-content" @click.stop>
      <h2 class="title">Реєстрація</h2>

      <label class="input-label">Ім’я</label>
      <input type="text" v-model="firstName" class="input-field" placeholder="Введіть ім’я" />

      <label class="input-label">Прізвище</label>
      <input type="text" v-model="lastName" class="input-field" placeholder="Введіть прізвище" />

      <label class="input-label">По-батькові</label>
      <input type="text" v-model="middleName" class="input-field" placeholder="Введіть по-батькові" />

      <label class="input-label">Місто</label>
      <input type="text" v-model="city" class="input-field" placeholder="Введіть місто" />

      <label class="input-label">Вулиця</label>
      <input type="text" v-model="street" class="input-field" placeholder="Введіть вулицю" />

      <label class="input-label">Електронна пошта</label>
      <input type="email" v-model="email" class="input-field" placeholder="Введіть електронну пошту" />

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

      <div class="terms-wrapper">
        <input type="checkbox" v-model="agreeTerms" />
        <span>
          Створюючи обліковий запис, я погоджуюсь з
          <span class="link" @click="showTerms = true">умовами користування сервісом.</span>
        </span>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="links">
        <span class="link" @click="$emit('hasAccount')">Увійти</span>
      </div>

      <button class="register-button" @click="handleRegister">Зареєструватися</button>

      <TermsModal :visible="showTerms" @close="showTerms = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import TermsModal from './TermsModal.vue'
import { showToast } from '../services/toast.js'

defineProps({
  visible: Boolean,
  transitionOnlyContent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'hasAccount'])

const firstName = ref('')
const lastName = ref('')
const middleName = ref('')
const city = ref('')
const street = ref('')
const email = ref('')
const password = ref('')
const agreeTerms = ref(false)
const showTerms = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

function togglePassword() {
  showPassword.value = !showPassword.value
}

function handleBackdropClick() {
  emit('close')
}
async function handleRegister() {
  errorMessage.value = ''

  if (!agreeTerms.value) {
    errorMessage.value = 'Потрібно погодитись з умовами користування.'
    return
  }

  try {
    const response = await fetch('https://backend-restoran.onrender.com/api/Account/Register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        middleName: middleName.value,
        email: email.value,
        password: password.value,
        city: city.value,
        street: street.value
      })
    })

    let dataText = ''
    let dataJson = {}
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      dataJson = await response.json()
    } else {
      dataText = await response.text()
    }

    if (!response.ok) {
      if (response.status === 400) {
        errorMessage.value = dataJson.message || dataText || 'Некоректні дані'
      } else if (response.status === 409) {
        errorMessage.value = 'Користувач з такою поштою вже існує.'
      } else {
        errorMessage.value = dataJson.message || dataText || 'Помилка під час реєстрації.'
      }
      return
    }

emit('close')
showToast('Реєстрація успішна! Тепер увійдіть.', 'success')

  } catch (error) {
    errorMessage.value = error.message || 'Сталася непередбачувана помилка.'
    console.error(error)
  }
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

.no-backdrop-animation {
  animation: none !important;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  max-height: 100%;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  animation: fadeInModal 0.4s ease-out;
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

@keyframes fadeInModal {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
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
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
}

.register-button {
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
  margin-top: 16px;
  text-align: left;
}

.link {
  text-decoration: underline;
  color: #007bff;
  cursor: pointer;
  font-size: 15px;
}

.terms-wrapper {
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.4;
}

.terms-wrapper input[type='checkbox'] {
  margin-top: 2px;
}

.terms-wrapper a {
  color: #007bff;
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
}
</style>
