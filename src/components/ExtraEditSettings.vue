<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-window">
      <h2>Редагування додаткових даних</h2>
      <form @submit.prevent="saveForm">

        <label class="field-label">
          Область
          <input v-model="form.region" placeholder="Область" />
          <div v-if="errors.region" class="error-text">{{ errors.region }}</div>
        </label>

        <label class="field-label">
          Місто / Населений пункт
          <input v-model="form.city" placeholder="Місто" />
          <div v-if="errors.city" class="error-text">{{ errors.city }}</div>
        </label>

        <label class="field-label">
          Вулиця та № будинку
          <input v-model="form.street" placeholder="Вулиця" />
          <div v-if="errors.street" class="error-text">{{ errors.street }}</div>
        </label>

        <label class="field-label">
          Електронна пошта (необов'язково)
          <input v-model="form.email" placeholder="example@email.com" />
        </label>

        <label class="field-label">
          Організація (необов'язково)
          <input v-model="form.organization" placeholder="Назва організації або залишити порожнім" />
        </label>

        <div class="actions">
          <button type="button" @click="close">Закрити</button>
          <button type="submit">Зберегти</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { geocodeAddress } from '../services/geocode'; 

export default {
  name: "ExtraEditSettings",

  props: {
    initialData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      form: {
        region: this.initialData.region || '',
        city: this.initialData.city || '',
        street: this.initialData.street || '',
        email: this.initialData.email || '',
        organization: this.initialData.organization || ''
      },
      errors: {
        region: '',
        city: '',
        street: '',
        addressError: '',
      },
      loadingCoords: false
    };
  },

  methods: {
    close() {
      this.$emit("close");
    },

    hasLetters(str) {
      return /[а-яА-ЯіїєґІЇЄҐa-zA-Z]/.test(str.trim());
    },

    async saveForm() {
      this.addressError = '';
      this.errors.region = '';
      this.errors.city = '';
      this.errors.street = '';

      if (!this.form.region.trim()) {
        this.errors.region = 'Поле Область не може бути порожнім';
      } else if (!this.hasLetters(this.form.region)) {
        this.errors.region = 'Поле Область має містити літери';
      }

      if (!this.form.city.trim()) {
        this.errors.city = 'Поле Місто не може бути порожнім';
      } else if (!this.hasLetters(this.form.city)) {
        this.errors.city = 'Поле Місто має містити літери';
      }

      if (!this.form.street.trim()) {
        this.errors.street = 'Поле Вулиця не може бути порожнім';
      } else if (!this.hasLetters(this.form.street)) {
        this.errors.street = 'Поле Вулиця має містити літери';
      }

      if (this.errors.region || this.errors.city || this.errors.street) {
        return;
      }

      this.loadingCoords = true;

      try {
        const coords = await geocodeAddress(this.form.region, this.form.city, this.form.street);
        this.loadingCoords = false;

      if (!coords) {
        this.addressError = 'Не вдалося визначити координати. Перевірте адресу.';
        return;
      }

        this.$emit('save', {
          ...this.form,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        this.close();
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
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-window {
  background: white;
  padding: 24px 32px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.field-label {
  display: block;
  margin-bottom: 16px;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.field-label input {
  margin-top: 6px;
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.field-label input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.actions button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.actions button[type="button"] {
  background-color: #eee;
  color: #555;
}

.actions button[type="button"]:hover {
  background-color: #ddd;
}

.actions button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

.actions button[type="submit"]:hover {
  background-color: #43a047;
}

.error-text {
  color: red;
  font-size: 0.85em;
  margin-top: 4px;
}
</style>
