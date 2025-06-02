<template>
  <div class="reservations">
    <h3>Мої резервації</h3>

    <ul v-if="reservations.length">
  <li v-for="res in reservations" :key="res.id" class="reservation-item">
    <div class="restaurant-name">🍽️ {{ res.restaurant?.name || 'Ресторан не вказано' }}</div>

    <div>
      📅 {{ formatDateTime(res.date).date }} о {{ formatDateTime(res.date).time }}
    </div>

    <div>👥 {{ res.peopleCount }} осіб</div>
  </li>
</ul>


    <p v-else>Немає запланованих резервацій.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProfileReservations',
  data() {
    return {
      reservations: []
    }
  },
  async mounted() {
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

      this.reservations = response.data || [];
    } catch (error) {
      console.error('Помилка при завантаженні резервацій:', error);
    }
  },
 methods: {
  formatDateTime(dateStr) {
    const dateObj = new Date(dateStr);

    const date = dateObj.toLocaleDateString('uk-UA', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const time = dateObj.toLocaleTimeString('uk-UA', {
      hour: '2-digit', minute: '2-digit'
    });

    return { date, time };
  }
}

}
</script>

<style scoped>
.reservations {
  padding: 20px;
}

.reservation-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.restaurant-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #d62d7e;
}
</style>
