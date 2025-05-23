<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">Реєстрація ресторану</h2>

      <label class="field-label">Адреса
        <input v-model="address" placeholder="Обл., н.п., вул., буд." />
      </label>

      <label class="field-label">Власник
        <input v-model="owner" placeholder="Повне ім’я або назва організації" />
      </label>

      <label class="field-label">Електрона пошта
        <input v-model="email" placeholder="Електрона пошта" />
      </label>

      <div class="modal-actions">
        <button class="continue-btn" @click="continueToConstructor">Далі ⇾</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: '',
      name: '',
      owner: '',
      email: ''
    }
  },
  methods: {
    continueToConstructor() {
      this.$router.push({
        name: 'RestaurantCreate',
        query: {
          address: this.address,
          owner: this.owner,
          email: this.email
        }
      });
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
  background: #fff;
  padding: 24px 32px;
  border-radius: 12px;
  width: 360px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  font-family: 'Segoe UI', sans-serif;
}

.modal-title {
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: bold;
  text-align: center;
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

.continue-btn:hover {
  background-color: #e65a4f;
}
</style>
