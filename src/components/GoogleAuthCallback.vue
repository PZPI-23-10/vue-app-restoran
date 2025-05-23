<!-- src/components/GoogleAuthCallback.vue -->
<template>
  <div class="auth-loading">
    Авторизація через Google...
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const hash = window.location.hash
  const params = new URLSearchParams(hash.slice(1)) // remove the '#' character

  const accessToken = params.get('access_token')
  const idToken = params.get('id_token')
  const error = params.get('error')

  if (error) {
    alert('Помилка входу: ' + error)
    router.push('/')
    return
  }

  if (accessToken) {
    localStorage.setItem('token', accessToken)
    localStorage.setItem('isAuthenticated', 'true')

    window.dispatchEvent(new Event('storage'))
    router.push('/')
  } else {
    alert('Не вдалося отримати токен доступу.')
    router.push('/')
  }
})
</script>

<style scoped>
.auth-loading {
  text-align: center;
  margin-top: 100px;
  font-size: 18px;
}
</style>
