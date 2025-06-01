<template>
  <div class="account-info">
    <h3>Інформація про акаунт</h3>

    <label>Ім’я</label>
    <input v-model="firstName" type="text" class="field" />

    <label>По батькові</label>
    <input v-model="middleName" type="text" class="field" />

    <label>Прізвище</label>
    <input v-model="lastName" type="text" class="field" />

    <label>Email</label>
    <input v-model="email" type="email" class="field" disabled />

    <label>Місто</label>
    <input v-model="city" type="text" class="field" />

    <label>Вулиця</label>
    <input v-model="street" type="text" class="field" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProfileUser',
  data() {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      city: '', 
      street: ''
    }
  },
  async mounted() {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      console.warn('userId відсутній у localStorage')
      return
    }

    try {
      const response = await axios.post(
        'https://backend-restoran.onrender.com/api/Account',
        { userId },
        { headers: { 'Content-Type': 'application/json' } }
      )

      const user = response.data

      this.firstName = user.firstName || ''
      this.middleName = user.middleName || ''
      this.lastName = user.lastName || ''
      this.email = user.email || ''
      this.city = user.city || 'Не вказано'
      this.street = user.street || 'Не вказано'
    } catch (error) {
      console.error(' Помилка при отриманні даних профілю:', error)
    }
  }
}
</script>

<style scoped>
.account-info {
  background: white;
  padding: 24px;

  margin: 0 auto;
  box-sizing: border-box;
}


label {
  display: block;
  font-weight: bold;
  margin-top: 16px;
}

.field {
  width: 100%;
  padding: 10px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f8f8f8;
  font-size: 14px;
}

</style>
