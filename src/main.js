import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const vMounted = {
    mounted: (el, binding) => {
        binding.value(el)
    }
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.directive('mounted', vMounted)
app.mount('#app')
