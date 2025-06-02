<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="visible">
      <div class="modal-content animate-in">
        <button class="close-button" @click="$emit('close')">✕</button>
        <h2 class="modal-title">Реєстрація ресторану</h2>

        <label class="field-label">
          Область
          <input v-model="region" placeholder="Область" />
          <div v-if="errors.region" class="error-text">{{ errors.region }}</div>
        </label>

        <label class="field-label">
          Місто / Населений пункт
          <input v-model="city" placeholder="Місто" />
          <div v-if="errors.city" class="error-text">{{ errors.city }}</div>
        </label>

        <label class="field-label">
          Вулиця та № будинку
          <input v-model="street" placeholder="Вулиця" />
          <div v-if="errors.street" class="error-text">{{ errors.street }}</div>
        </label>

        <label class="field-label">
          Електронна пошта (необов'язково)
          <input v-model="email" placeholder="example@email.com" />
        </label>

        <label class="field-label">
          Організація (необов'язково)
          <input v-model="organization" placeholder="Назва організації або залишити порожнім" />
        </label>

        <div class="modal-actions">
          <button class="continue-btn" @click="continueToConstructor" :disabled="loadingCoords">
            Далі ⇾
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { geocodeAddress } from '../services/geocode'; 

export default {
  emits: ['close'],
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isAddressFilled() {
      return this.region.trim() && this.city.trim() && this.street.trim();
    }
  },
  data() {
    return {
      region: '',
      city: '',
      street: '',
      organization: '',
      email: '',
      errors: {
        region: false,
        city: false,
        street: false
      },
      loadingCoords: false,
    };
    
  },
  
  computed: {
    isAddressFilled() {
      return this.region.trim() && this.city.trim() && this.street.trim();
    }
  },

  methods: {
    hasLetters(str) {
      return /[a-zA-Zа-яА-Я]/.test(str);
    },

    async continueToConstructor() {
      this.errors.region = '';
      this.errors.city = '';
      this.errors.street = '';

      if (!this.region.trim()) {
        this.errors.region = 'Поле Область не може бути порожнім';
      } else if (!this.hasLetters(this.region)) {
        this.errors.region = 'Поле Область має містити літери';
      }

      if (!this.city.trim()) {
        this.errors.city = 'Поле Місто не може бути порожнім';
      } else if (!this.hasLetters(this.city)) {
        this.errors.city = 'Поле Місто має містити літери';
      }

      if (!this.street.trim()) {
        this.errors.street = 'Поле Вулиця не може бути порожнім';
      } else if (!this.hasLetters(this.street)) {
        this.errors.street = 'Поле Вулиця має містити літери';
      }

      if (this.errors.region || this.errors.city || this.errors.street) {
        return;
      }

      this.loadingCoords = true;

      try {
        const coords = await geocodeAddress(this.region, this.city, this.street);
        this.loadingCoords = false;

        if (!coords) {
          const errMsg = 'Не вдалося визначити координати за цією адресою. Перевірте правильність.';
          this.errors.region = errMsg;
          this.errors.city = errMsg;
          this.errors.street = errMsg;
          return;
        }

        const address = `${this.region}, ${this.city}, ${this.street}`;
        this.$router.push({
          name: 'RestaurantCreate',
          query: {
            address,
            email: this.email,
            organization: this.organization,
            lat: coords.latitude,
            lon: coords.longitude
          }
        });
      } catch (e) {
        this.loadingCoords = false;
        const errMsg = 'Помилка при визначенні координат. Спробуйте пізніше.';
        this.errors.region = errMsg;
        this.errors.city = errMsg;
        this.errors.street = errMsg;
        console.error(e);
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: #fff;
  padding: 24px 32px;
  border-radius: 12px;
  width: 380px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  font-family: 'Segoe UI', sans-serif;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.25s ease-out;
}

.modal-content.animate-in {
  opacity: 1;
  transform: scale(1);
}

.close-button {
  position: absolute;
  top: 14px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-title {
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: bold;
  text-align: center;
}

.error-text {
  color: red;
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
}

.input-error {
  border: 2px solid #ff4d4f;
  border-radius: 6px;
}

.field-label {
  display: block;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 4px;
  color: #333;
}

.field-label input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 4px;
  box-sizing: border-box;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.continue-btn {
  background-color: #ff6f61;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.error-text {
  color: red;
  font-size: 0.85em;
  margin-top: 4px;
}

.continue-btn:hover {
  background-color: #e65a4f;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
