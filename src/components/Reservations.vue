<template>
  <div>
    <h3>Мої резервації</h3>
    <ul v-if="reservations.length">
      <li v-for="(res, index) in reservations" :key="index">
        📅 {{ res.date }} о {{ res.time }} — {{ res.people }} осіб
      </li>
    </ul>
    <p v-else>Немає запланованих резервацій.</p>
  </div>
</template>

<script>
export default {
  name: 'Reservations',
  data() {
    return {
      reservations: [] // Можеш підключити API для отримання
    }
  }
}
</script>

<style scoped>
ul {
  padding-left: 16px;
}
</style>
