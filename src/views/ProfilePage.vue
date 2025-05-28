<template>
  <div class="profile-page">
    <h1>Профіль користувача</h1>

    <div class="profile-info" v-if="isAuthenticated">
      <p><strong>ПІБ:</strong> {{ userName }}</p>
      <p><strong>Email:</strong> {{ userEmail }}</p>
      <p><strong>Місто:</strong> {{ userCity }}</p>
      <p><strong>Адреса:</strong> {{ address || 'Не вказано' }}</p>
      <p><strong>Улюблені страви:</strong> {{ favoriteDishes || 'Немає' }}</p>
      <p><strong>Улюблений ресторан:</strong> {{ favoriteRestaurant || 'Немає' }}</p>
      <p><strong>Дата створення:</strong> {{ dateCreated }}</p>
      <p><strong>Дата оновлення:</strong> {{ dateUpdated }}</p>
    </div>

    <div v-else class="not-authenticated">
      <p>Будь ласка, увійдіть у систему, щоб переглянути профіль.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      isAuthenticated: false,
      userName: '',
      userEmail: '',
      userCity: '',
      address: '',
      favoriteDishes: '',
      favoriteRestaurant: '',
      dateCreated: '',
      dateUpdated: ''
    }
  },
  mounted() {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    if (this.isAuthenticated) {
      this.userName = localStorage.getItem('name') || 'Ім’я невідоме'
      this.userEmail = localStorage.getItem('email') || ''
      this.userCity = localStorage.getItem('city') || 'Не вказано'
      this.address = localStorage.getItem('address') || ''
      this.favoriteDishes = localStorage.getItem('favoriteDishes') || ''
      this.favoriteRestaurant = localStorage.getItem('favoriteRestaurant') || ''
      this.dateCreated = localStorage.getItem('dateCreated') || ''
      this.dateUpdated = localStorage.getItem('dateUpdated') || ''
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 40px;
  font-family: 'Segoe UI', sans-serif;
}

.profile-info {
  background: #f1f1f1;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  line-height: 1.8;
}

.not-authenticated {
  color: red;
  font-weight: bold;
}
</style>
