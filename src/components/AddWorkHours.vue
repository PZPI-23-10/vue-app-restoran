<template>
  <transition name="modal-scale">
    <div class="modal-overlay" v-if="visible" @click.self="close">
      <transition name="toast">
        <div class="toast-message" v-if="showToast">
          День був збережений
        </div>
      </transition>
      <div class="modal-window">
        <div class="work-hours-form">
          <h2>Встановлення робочого часу</h2>

          <div class="row">
            <div class="input-field">
              <label>Відкриття</label>
              <input 
                type="time" 
                v-model="workHours.open" 
                :disabled="workHours.isDayOff" 
              />
            </div>

            <div class="input-field">
              <label>Закриття</label>
              <input 
                type="time" 
                v-model="workHours.close" 
                :disabled="workHours.isDayOff" 
              />
            </div>
          </div>

          <div class="input-field">
            <label>День</label>
            <select v-model="workHours.day">
              <option disabled value="">Оберіть день</option>
              <option v-for="day in daysOfWeek" :key="day" :value="day">{{ day }}</option>
            </select>
          </div>

          <div class="actions">
            <div class="button-group">
              <button class="cancel" @click="close">Вихід</button>
            </div>

            <div class="button-group center-group">
              <button
                class="day-off-btn"
                @click="setDayOff"
                :disabled="!workHours.day || workHours.isDayOff"
              >
                Вихідний
              </button>

              <button
                class="working-day-btn"
                @click="setWorkingDay"
                :disabled="!workHours.day || !workHours.isDayOff"
              >
                Робочий день
              </button>

              <button
                class="submit"
                @click="saveCurrentDay"
                :disabled="!workHours.day"
              >
                Зберегти день
              </button>
            </div>

            <div class="button-group">
              <button class="submit" @click="saveAll" :disabled="savedHours.length === 0">
                Зберегти всі
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AddWorkHours",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close", "save"],
  data() {
    return {
      showToast: false,
      daysOfWeek: [
        "Понеділок",
        "Вівторок",
        "Середа",
        "Четвер",
        "П’ятниця",
        "Субота",
        "Неділя",
      ],
      workHours: {
        open: "",
        close: "",
        day: "",
        isDayOff: false,
      },
      savedHours: [],
    };
  },
  watch: {
    'workHours.day'(newDay) {
      const existing = this.savedHours.find(entry => entry.day === newDay);
      if (existing) {
        this.workHours.open = existing.open || "";
        this.workHours.close = existing.close || "";
        this.workHours.isDayOff = existing.isDayOff || false;
      } else {
        this.resetForm(false);
      }
    }
  },
  created() {
  const saved = localStorage.getItem('restaurant_schedule');
  if (saved) {
    this.savedHours = JSON.parse(saved);
  }
},
  methods: {
    close() {
      this.$emit("close");
      this.resetForm();
    },
    resetForm(full = true) {
      this.workHours = {
        open: "",
        close: "",
        day: full ? "" : this.workHours.day,
        isDayOff: false,
      };
    },
    setWorkingDay() {
      this.workHours.isDayOff = false;
    },
    setDayOff() {
      if (!this.workHours.day) {
        alert("Оберіть день, щоб встановити вихідний");
        return;
      }
      this.workHours.isDayOff = true;
      this.workHours.open = "";
      this.workHours.close = "";
    },
    saveAll() {
      localStorage.setItem('restaurant_schedule', JSON.stringify(this.savedHours));
      this.$emit("save", this.savedHours); 
      this.showToastMessage();
    },
    saveCurrentDay() {
      if (!this.workHours.day) return;

      const entry = {
        day: this.workHours.day,
        isDayOff: this.workHours.isDayOff,
        ...(this.workHours.isDayOff ? {} : {
          open: this.workHours.open,
          close: this.workHours.close,
        }),
      };

      const index = this.savedHours.findIndex(e => e.day === entry.day);
      if (index !== -1) this.savedHours.splice(index, 1, entry);
      else this.savedHours.push(entry);

      localStorage.setItem('restaurant_schedule', JSON.stringify(this.savedHours));

      this.showToastMessage();
    },
    showToastMessage() {
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      
      this.showToast = true;
      this.toastTimeout = setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
}

.modal-window {
  background: white;
  padding: 28px;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.work-hours-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

h2 {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 15px;
  color: #555;
  font-weight: 500;
}

input, select {
  padding: 13px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 15px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f9f9f9;
}

input:focus, select:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  background-color: white;
  outline: none;
}

.row {
  display: flex;
  gap: 15px;
}

.row .input-field {
  flex: 1;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.center-group {
  justify-content: center;
  flex: 1;
}

button {
  padding: 11px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

button.submit {
  background-color: #ff6b6b;
  color: white;
  border: 1px solid #ff6b6b;
}

button.submit:hover {
  background-color: #e85a5a;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button.submit:disabled {
  background-color: #ffb6b6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

button.cancel {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

button.cancel:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
  transform: translateY(-1px);
}

button.day-off-btn {
  background-color: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

button.day-off-btn:hover {
  background-color: #ffecec;
}

button.working-day-btn {
  background-color: transparent;
  color: #4CAF50;
  border: 1px solid #4CAF50;
}

.toast-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #266928;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10002;
  font-size: 15px;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

@keyframes slideDown {
  from {
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}


button.working-day-btn:hover {
  background-color: #e8f5e9;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.35s cubic-bezier(0.36, 0.66, 0.04, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
}

.modal-scale-enter-active .modal-window,
.modal-scale-leave-active .modal-window {
  transition: all 0.35s cubic-bezier(0.36, 0.66, 0.04, 1);
}

.modal-scale-enter-from .modal-window {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-scale-enter-to .modal-window {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.modal-scale-leave-to .modal-window {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>