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
  </div>
</template>

<script>
export default {
  name: 'ProfilePage'
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
</style>
