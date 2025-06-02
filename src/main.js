import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import GoogleLoginPlugin from 'vue3-google-login'

const app = createApp(App)

app.use(router)

app.use(GoogleLoginPlugin, {
  clientId: '144739779523-nnu4avrae8mavp9vhlbdhvihractabar.apps.googleusercontent.com'
})

app.mount('#app')
