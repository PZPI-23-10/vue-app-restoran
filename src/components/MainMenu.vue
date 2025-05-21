<template>
  <header class="main-header">
    <div class="left-side">
      <span class="logo-text">Сервіс для ресторанів</span>
      <div class="divider"></div>
      <LocationDropdown/>
    </div>

     <div class="right-buttons">
      <button class="download-btn">Завантажити додаток</button>
      <button class="login-btn" @click="openLogin">Увійти</button>
    </div>
  </header>

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

</template>

<script>
import LoginModal from './LoginModal.vue'
import RegisterModal from './RegisterModal.vue'
import ForgotPasswordModal from './ForgotPasswordModal.vue'
import LocationDropdown from './LocationDropdown.vue'
export default {
  name: 'MainMenu',
  components: {
    LoginModal,
    RegisterModal,
    ForgotPasswordModal,
    LocationDropdown 
  },
  data() {
    return {
      showLogin: false,
      showRegister: false,
      showForgot: false,
      transitionOnly: false
    }
  },
  methods: {
    openLogin() {
      this.transitionOnly = this.showRegister || this.showForgot
      this.showLogin = true
      this.showRegister = false
      this.showForgot = false
    },
    openRegister() {
      this.transitionOnly = this.showLogin
      this.showRegister = true
      this.showLogin = false
      this.showForgot = false
    },
    openForgot() {
      this.transitionOnly = true
      this.showForgot = true
      this.showLogin = false
      this.showRegister = false
    }
  }
}
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px 30px;
  border-bottom: 2px solid #00BCD4;
  font-family: 'Segoe UI', sans-serif;
}

.left-side {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-text {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: #aaa;
}

.right-buttons {
  display: flex;
  gap: 12px;
}

.download-btn,
.login-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background-color: #FF6F61;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.download-btn:hover,
.login-btn:hover {
  background-color: #e25b4e;
}
</style>