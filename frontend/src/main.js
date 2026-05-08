import '../../frontend/src/assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '../../frontend/src/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
