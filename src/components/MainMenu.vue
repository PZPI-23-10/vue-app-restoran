<template>
  <header class="main-header">
    <div class="left-side">
      <router-link to="/" class="logo-text">Сервіс для ресторанів</router-link>
      <div class="divider"></div>
      <LocationDropdown @citySelected="handleCitySelected" />
    </div>

    <div class="right-buttons">
      <!-- Заменили кнопку на ссылку -->
      <a
        href="https://drive.google.com/uc?export=download&id=1habu7kATKt8uOhTY7O8jLU9kCm77XEtk"
        download
        class="download-btn"
      >
        Завантажити додаток
      </a>

      <div class="profile-wrapper" v-if="isAuthenticated">
        <button class="profile-btn" @click.stop="toggleMenu">
          <svg class="profile-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
          </svg>
          <span class="profile-email">{{ userEmail }}</span>
        </button>

        <div v-if="menuOpen" class="dropdown-menu" @click.stop>
          <router-link to="/profile/info" class="dropdown-item">Профіль</router-link>
          <button @click="logout" class="dropdown-item">Вийти</button>
        </div>
      </div>

      <button class="login-btn" v-else @click="openLogin">Увійти</button>
    </div>

    <LoginModal :visible="showLogin" @close="showLogin = false" @register="openRegister" @forgot="openForgot" />
    <RegisterModal :visible="showRegister" @close="showRegister = false" />
    <ForgotPasswordModal :visible="showForgot" @close="showForgot = false" />
  </header>
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
      isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
      menuOpen: false
    }
  },
  computed: {
    userEmail() {
      return localStorage.getItem('email') || 'Акаунт'
    }
  },
  mounted() {
    window.addEventListener('storage', this.syncAuth)
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncAuth)
    document.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    openLogin() {
      this.showLogin = true
      this.showRegister = false
      this.showForgot = false
    },
    openRegister() {
      this.showRegister = true
      this.showLogin = false
      this.showForgot = false
    },
    openForgot() {
      this.showForgot = true
      this.showLogin = false
      this.showRegister = false
    },
    logout() {
      localStorage.clear()
      this.syncAuth()
      this.menuOpen = false
      this.$router.push('/')
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    syncAuth() {
      this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      // userEmail теперь обновляется сам по computed
    },
    handleCitySelected(city) {
      this.$emit('citySelected', city)
      this.$router.push({ name: 'RestaurantPageList', params: { city } })
    },
    handleOutsideClick(event) {
      const menu = this.$el.querySelector('.dropdown-menu')
      const button = this.$el.querySelector('.profile-btn')

      if (this.menuOpen && menu && !menu.contains(event.target) && !button.contains(event.target)) {
        this.menuOpen = false
      }
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
  text-decoration: none;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: #aaa;
}

.right-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.download-btn,
.login-btn,
.profile-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-btn,
.login-btn {
  background-color: #ff6f61;
  color: white;
}

.profile-btn {
  background-color: #f9f9f9;
  color: black;
}

.profile-btn:hover,
.download-btn:hover,
.login-btn:hover {
  background-color: #e25b4e;
}

.profile-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.profile-icon {
  width: 20px;
  height: 20px;
}

.profile-email {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  min-width: 140px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 10px 14px;
  color: #333;
  text-align: left;
  text-decoration: none;
  font-size: 14px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover,
.active-dropdown {
  background-color: #f0f0f0;
}
</style>
