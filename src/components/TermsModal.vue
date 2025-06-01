<template>
  <div class="modal-backdrop" v-if="visible" @click.self="close">
    <div class="modal-content">
      <div class="header">
        <h1 class="title">Умови користування сервісом</h1>
        <button class="back-button" @click="backToRegister">Назад</button>
      </div>

      <div class="content">
        <p><strong>Останнє оновлення: 02.05.2025</strong></p>
        <p>
          Будь ласка, уважно ознайомтеся з цими Умовами користування перед реєстрацією в нашому сервісі.
          Відвідуючи, використовуючи або реєструючись у Сервісі, ви погоджуєтеся дотримуватись цих Умов.
        </p>

        <h2>1. Опис сервісу</h2>
        <ul>
          <li>здійснювати онлайн-бронювання столиків у ресторанах;</li>
          <li>переглядати меню, робити попереднє замовлення страв;</li>
          <li>залишати та читати відгуки;</li>
          <li>отримувати спеціальні пропозиції, бонуси та знижки.</li>
        </ul>

        <h2>2. Реєстрація та обліковий запис</h2>
        <p>2.1. Для повноцінного користування Сервісом вам необхідно створити обліковий запис, надавши актуальні та достовірні дані.</p>
        <p>2.2. Ви зобов’язуєтеся забезпечити конфіденційність вашого логіна та пароля, а також несете повну відповідальність за всі дії, здійснені під вашим обліковим записом.</p>

        <h2>3. Бронювання та замовлення</h2>
        <p>3.1. Бронювання столика або оформлення замовлення можливе лише за умови підтвердження з боку ресторану.</p>
        <p>3.2. У разі запізнення або неявки користувача, ресторан залишає за собою право скасувати бронювання.</p>
        <p>3.3. Замовлення страв онлайн не є оплатою, якщо інше не вказано. Оплата відбувається на місці або за допомогою платіжних засобів, передбачених Сервісом.</p>

        <h2>4. Відгуки та контент користувачів</h2>
        <p>4.1. Ви можете залишати відгуки, коментарі та інший контент, що не є образливим, неправдивим або незаконним.</p>
        <p>4.2. Адміністрація має право видаляти або редагувати контент без пояснення причин.</p>

        <h2>5. Права інтелектуальної власності</h2>
        <p>5.1. Увесь контент Сервісу (дизайн, логотипи, тексти, бази даних тощо) є власністю “Сервіс для ресторанів” або партнерів.</p>
        <p>5.2. Копіювання, поширення або використання без письмового дозволу заборонено.</p>

        <h2>6. Відповідальність</h2>
        <p>6.1. Сервіс не несе відповідальності за дії ресторанів, зокрема за якість обслуговування, страв чи дотримання бронювань.</p>
        <p>6.2. Ми не гарантуємо безперебійну роботу Сервісу та не відповідаємо за можливі технічні збої.</p>

        <h2>7. Конфіденційність</h2>
        <p>7.1. Обробка персональних даних здійснюється відповідно до нашої Політики конфіденційності.</p>

        <h2>8. Прикінцеві положення</h2>
        <p>8.1. Адміністрація має право вносити зміни до цих Умов. Зміни набирають чинності з моменту їх публікації на сайті/в додатку.</p>
        <p>8.2. Продовження користування Сервісом після змін означає вашу згоду з оновленими Умовами.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ visible: Boolean })

const emit = defineEmits(['close', 'back'])

function backToRegister() {
  emit('back')
  emit('close')
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  animation: fade-in 0.3s ease;
}

.back-button {
  background-color: #FF6F61;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #e95b4f;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #FF6F61;
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 15px;
  text-decoration: underline;
}

.content h2 {
  margin-top: 20px;
  color: #333;
  font-size: 17px;
}

.content p, .content li {
  font-size: 15px;
  margin-top: 6px;
  line-height: 1.5;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes fade-in {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
