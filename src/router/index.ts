import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import i18n from '@/i18n'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      titleKey: 'nav.home',
      descKey: 'home.homeDesc'
    }
  },
  {
    path: '/chart',
    name: 'chart',
    component: () => import('../views/KanaChartView.vue'),
    meta: {
      titleKey: 'nav.chart',
      descKey: 'chart.desc'
    }
  },
  {
    path: '/practice',
    name: 'practice',
    component: () => import('../views/PracticeView.vue'),
    meta: {
      titleKey: 'nav.practice',
      descKey: 'practice.desc'
    }
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/ProgressView.vue'),
    meta: {
      titleKey: 'nav.progress',
      descKey: 'progressPage.desc'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  const titleKey = to.meta.titleKey as string | undefined
  const descKey = to.meta.descKey as string | undefined

  const baseTitle = 'TM-KANA'
  if (titleKey) {
    const translatedTitle = i18n.global.t(titleKey)
    document.title = `${translatedTitle} - ${baseTitle}`
  } else {
    document.title = baseTitle
  }

  if (descKey) {
    const translatedDesc = i18n.global.t(descKey)
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', translatedDesc)
  }
})

export default router
