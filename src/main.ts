import { createApp, ref, h } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import './style.css'
import App from './App.vue'
import ErrorFallback from './components/ErrorFallback.vue'

const hasError = ref(false)
const errorObject = ref<Error | null>(null)

const app = createApp({
  setup() {
    return { hasError, errorObject }
  },
  render() {
    if (this.hasError) {
      return h(ErrorFallback, { error: this.errorObject })
    }
    return h(App)
  }
})

app.config.errorHandler = (err, _instance, info) => {
  console.error('Unhandled Global Error:', err, info)
  errorObject.value = err as Error
  hasError.value = true
}

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
