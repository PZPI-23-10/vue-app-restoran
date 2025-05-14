<template>
  <header class="main-header">
    <div class="left-side">
      <span class="logo-text">Сервіс для ресторанів</span>
      <div class="divider"></div>
      <span class="material-icons">location_on</span>
    </div>

    <div class="right-buttons">
      <button class="download-btn">Завантажити додаток</button>
      <button class="login-btn">Увійти</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'MainMenu'
}
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px 30px;
  border-bottom: 2px solid #00BCD4;
  font-family: 'Segoe UI', sans-serif;
}

.left-side {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-text {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: #aaa;
}

.right-buttons {
  display: flex;
  gap: 12px;
}

.download-btn,
.login-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background-color: #FF6F61;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.download-btn:hover,
.login-btn:hover {
  background-color: #e25b4e;
}
</style>
