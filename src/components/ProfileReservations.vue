<template>
  <div class="reservations">
    <h3>Мої резервації</h3>

    <div v-if="reservations.length" class="reservation-list">
      <div v-for="res in reservations" :key="res.reservationId" class="reservation-card">
        <div class="reservation-header">
          <img :src="res.restaurantPhoto" alt="Фото ресторану" class="restaurant-photo" />
          <div class="restaurant-info">
            <h4>{{ res.restaurantName || 'Ресторан не вказано' }}</h4>
            <p>
              <span class="material-icons">location_on</span>
              {{ res.restaurantRegion }}, {{ res.restaurantCity }}, {{ res.restaurantStreet }}
            </p>
          </div>
        </div>

        <div class="reservation-details">
          <div>📅 {{ formatDateTime(res.date).date }} о {{ formatDateTime(res.date).time }}</div>
          <div>👥 {{ res.peopleCount }} осіб</div>
        </div>

        <div class="actions">
          <button @click="openDeleteModal(res.reservationId)">Скасувати</button>
        </div>
      </div>
    </div>

    <p v-else>Немає запланованих резервацій.</p>

    <!-- Модалка -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h4>Підтвердження</h4>
        <p>Ви дійсно бажаєте скасувати резервацію?</p>
        <div class="modal-actions">
          <button class="confirm" @click="confirmDelete">Так, скасувати</button>
          <button class="cancel" @click="closeModal">Скасувати</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProfileReservations',
  data() {
    return {
      reservations: [],
      showModal: false,
      reservationToDelete: null
    }
  },
  async mounted() {
    await this.fetchReservations();
  },
  methods: {
    async fetchReservations() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Користувач не авторизований');
        return;
      }

      try {
        const response = await axios.get(
          'https://backend-restoran.onrender.com/api/Reservations/ReservationsByUser',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log('Отримані резервації:', response.data);
        this.reservations = response.data || [];
      } catch (error) {
        console.error('Помилка при завантаженні резервацій:', error);
      }
    },

    formatDateTime(dateStr) {
      const dateObj = new Date(dateStr);
      const date = dateObj.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/\./g, '').trim();
      const time = dateObj.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      return { date, time };
    },

    openDeleteModal(reservationId) {
      this.reservationToDelete = reservationId;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.reservationToDelete = null;
    },

    async confirmDelete() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        await axios.delete(
          `https://backend-restoran.onrender.com/api/Reservations/${this.reservationToDelete}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        this.reservations = this.reservations.filter(r => r.reservationId !== this.reservationToDelete);
        this.closeModal();
      } catch (error) {
        console.error('Помилка при скасуванні резервації:', error);
        this.closeModal();
      }
    }
  }
}
</script>

<style scoped>
.reservations {
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.reservation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reservation-card {
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.reservation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 12px rgba(0,0,0,0.15);
}

.reservation-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.restaurant-photo {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ccc;
}

.restaurant-info h4 {
  margin: 0;
  color: #d62d7e;
}

.reservation-details {
  font-size: 16px;
  margin-bottom: 10px;
}

.actions {
  text-align: right;
}

.actions button {
  background-color: #d9534f;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.actions button:hover {
  background-color: #c9302c;
}

.restaurant-info p .material-icons {
  vertical-align: middle;
  font-size: 18px;
  margin-right: 4px;
}

/* Стили для модалки */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.modal-actions .confirm {
  background-color: #d9534f;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.modal-actions .cancel {
  background-color: #ddd;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
