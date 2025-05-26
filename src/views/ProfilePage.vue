<!-- src/views/ProfilePage.vue -->
<template>
  <div class="profile-page">
    <h1>Профіль користувача</h1>

    <div class="profile-info">
      <p><strong>Ім'я:</strong> Іван Іванов</p>
      <p><strong>Email:</strong> ivan@example.com</p>
      <p><strong>Місто:</strong> Київ</p>
      <!-- Тут можна додати редагування, зміну паролю, замовлення, тощо -->
    </div>

        <button class="create-btn" @click="showModal = true">Створити ресторан</button>
        <RestaurantInitModal :visible="showModal" @close="showModal = false" />
  </div>
</template>

<script>
import RestaurantInitModal from '../components/RestaurantInitModal.vue';

export default {
    name: 'ProfilePage',
    components: {
      RestaurantInitModal
    },
    data() {
    return {
      showModal: false
    };
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
  max-width: 400px;
}

.create-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.create-btn:hover {
  background-color: #006fa1;
}
</style>
