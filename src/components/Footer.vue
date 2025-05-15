<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        © 2025 Назва сайту. Всі права захищено.
      </div>
      <div class="footer-right">
        <a href="https://facebook.com" target="_blank" class="icon facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://instagram.com" target="_blank" class="icon instagram">
          <i class="fab fa-instagram"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #2c2c2c;
  color: #fff;
  padding: 10px 20px;
  font-size: 14px;
  margin-top: auto; /* Важно: сдвигает футер вниз */
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  color: #ccc;
}

.footer-right {
  display: flex;
  gap: 16px;
}

.icon {
  font-size: 18px;
  text-decoration: none;
  transition: transform 0.2s;
}

.icon:hover {
  transform: scale(1.2);
}

.facebook {
  color: #1877f2;
}

.instagram {
  color: #fca311;
}
</style>
