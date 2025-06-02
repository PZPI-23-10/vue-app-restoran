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

    <button class="save-button" @click="editUser" :disabled="!hasChanges">
      Зберегти зміни
    </button>

    <div v-if="showSuccessModal" class="modal-backdrop">
      <div class="modal-window">
        <p>Зміни виконані успішно!</p>
        <button @click="showSuccessModal = false">Ок</button>
      </div>
    </div>
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
      street: '',
      originalData: {
        firstName: '',
        middleName: '',
        lastName: '',
        city: '',
        street: ''
      },
      showSuccessModal: false
    }
  },
  mounted() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    axios.post('https://backend-restoran.onrender.com/api/Account', { userId })
      .then(response => {
        const user = response.data;
        this.firstName = user.firstName || '';
        this.middleName = user.middleName || '';
        this.lastName = user.lastName || '';
        this.email = user.email || '';
        this.city = user.city || '';
        this.street = user.street || '';

        this.originalData = {
          firstName: user.firstName || '',
          middleName: user.middleName || '',
          lastName: user.lastName || '',
          city: user.city || '',
          street: user.street || ''
        };
      })
      .catch(err => console.error('Помилка при завантаженні користувача', err));
  },
  computed: {
  hasChanges() {
    if (!this.originalData) return false;
    return (
      this.firstName !== this.originalData.firstName ||
      this.middleName !== this.originalData.middleName ||
      this.lastName !== this.originalData.lastName ||
      this.city !== this.originalData.city ||
      this.street !== this.originalData.street
    );
  }
},
  methods: {
    async editUser() {
      try {
        const token = localStorage.getItem('token')
        console.log(token)
        const response = await axios.post(
          'https://backend-restoran.onrender.com/api/Account/EditUser',
          {
            firstName: this.firstName,
            lastName: this.lastName,
            middleName: this.middleName,
            email: this.email,
            city: this.city,
            street: this.street
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        )

        this.showSuccessModal = true
        this.originalData = { ...this.$data }
      } catch (error) {
        console.error('Помилка при збереженні змін:', error)
        alert('Не вдалося зберегти зміни')
      }
    },
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

.save-button {
  margin-top: 24px;
  padding: 10px 20px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-window {
  background: white;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
}

.modal-window button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

</style>
