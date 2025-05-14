<script setup>
import { ref } from 'vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import ForgotPasswordModal from './components/ForgotPasswordModal.vue'

const showLogin = ref(false)
const showRegister = ref(false)
const showForgot = ref(false)
const transitionOnly = ref(false)

function openLogin() {
  transitionOnly.value = showRegister.value || showForgot.value
  showLogin.value = true
  showRegister.value = false
  showForgot.value = false
}

function openRegister() {
  transitionOnly.value = showLogin.value
  showRegister.value = true
  showLogin.value = false
  showForgot.value = false
}

function openForgot() {
  transitionOnly.value = true
  showForgot.value = true
  showLogin.value = false
  showRegister.value = false
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
  </header>

  <main>
    <button class="login-button" @click="openLogin">Увійти</button>

    <LoginModal
      :visible="showLogin"
      :transitionOnlyContent="transitionOnly"
      @close="showLogin = false"
      @register="openRegister"
      @forgot="openForgot"
    />

    <RegisterModal
      :visible="showRegister"
      :transitionOnlyContent="transitionOnly"
      @close="showRegister = false"
      @hasAccount="openLogin"
    />

    <ForgotPasswordModal
      :visible="showForgot"
      :transitionOnlyContent="transitionOnly"
      @close="showForgot = false"
      @back="openLogin"
    />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.login-button {
  display: block;
  margin: 2rem auto;
  padding: 10px 24px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>