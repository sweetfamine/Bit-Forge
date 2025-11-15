import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { icons } from 'lucide-vue-next'

const app = createApp(App)

Object.entries(icons).forEach(([name, component]) => {
  app.component(name, component)
})

app.mount('#app')
