  <template>
    <div class="auth-loading">
      Авторизація через Google...
    </div>
  </template>

  <script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
onMounted(async () => {
  const hash = window.location.hash
  console.log("URL Hash:", hash) // Выводим весь hash из URL

  const params = new URLSearchParams(hash.slice(1))

  const accessToken = params.get('access_token')
  console.log("Access Token:", accessToken)  // Вот здесь выводим сам токен
const idToken = params.get('id_token');
console.log("ID Token:", idToken);

  const error = params.get('error')

  if (error) {
    alert('Помилка входу: ' + error)
    router.push('/')
    return
  }

  if (accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const user = await response.json()

      if (user?.email) {
        localStorage.setItem('token', accessToken)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('email', user.email)

        window.dispatchEvent(new Event('storage'))
        router.push('/')
      } else {
        alert('Не вдалося отримати email користувача.')
        router.push('/')
      }
    } catch (e) {
      console.error(e)
      alert('Сталася помилка при зверненні до Google API.')
      router.push('/')
    }
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
