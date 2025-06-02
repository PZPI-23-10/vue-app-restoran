<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" class="message" :class="{ 'my-message': isMyMessage(msg) }">
        <b>{{ msg.senderName }}:</b> {{ msg.text }}
      </div>
    </div>

    <div class="input-area">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Введіть повідомлення..." />
      <button @click="sendMessage">Надіслати</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ChatService from '../services/chat.service'
import AuthService from '../services/auth.service'
import { useRoute } from 'vue-router'

const route = useRoute()
const sessionId = route.params.sessionId

const messages = ref([])
const newMessage = ref('')
const user = AuthService.getCurrentUser()

onMounted(async () => {
  await ChatService.startConnection();
  ChatService.onMessageReceived = addMessage;
  await ChatService.joinSession(sessionId);
});

onBeforeUnmount(() => {
  ChatService.stopConnection();
});

function addMessage(msg) {
  messages.value.push(msg);
}

function isMyMessage(msg) {
  return msg.senderId === user.userId;
}

async function sendMessage() {
  if (!newMessage.value.trim()) return;
  await ChatService.sendMessage(newMessage.value);
  newMessage.value = '';
}
</script>

<style scoped>
.chat-container { display: flex; flex-direction: column; height: 100%; border: 1px solid #ccc; }
.messages { flex: 1; overflow-y: auto; padding: 10px; }
.message { margin-bottom: 10px; padding: 8px; background: #eee; border-radius: 8px; }
.my-message { background: #d62d7e; color: white; align-self: flex-end; }
.input-area { display: flex; padding: 10px; }
input { flex: 1; padding: 8px; margin-right: 10px; }
button { padding: 8px 16px; background: #d62d7e; color: white; border: none; border-radius: 4px; }
</style>
