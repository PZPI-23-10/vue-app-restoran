<template>
  <div class="moderation-page">
    <h2>Модерація чатів</h2>

    <div v-if="sessions.length">
      <div v-for="session in sessions" :key="session.id" class="session-item">
        <div>{{ session.userEmail }}</div>
        <button @click="openChat(session.id)">Відкрити чат</button>
      </div>
    </div>

    <div v-else>
      Немає активних чатів.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChatService from '../services/chat.service'
import { useRouter } from 'vue-router'

const sessions = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    sessions.value = await ChatService.getActiveSessions()
  } catch (e) {
    console.error('Помилка при завантаженні сесій:', e)
  }
})

function openChat(sessionId) {
  router.push(`/chat/${sessionId}`)
}
</script>

<style scoped>
.session-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}
button {
  padding: 8px 16px;
  background: #d62d7e;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
