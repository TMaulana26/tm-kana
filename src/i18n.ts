import { createI18n } from 'vue-i18n'
import id from './locales/id.json'
import en from './locales/en.json'
import ja from './locales/ja.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'id',
  fallbackLocale: 'en',
  messages: {
    id,
    en,
    ja
  }
})

export default i18n
