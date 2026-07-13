import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/chart',
    name: 'chart',
    component: () => import('../views/KanaChartView.vue')
  },
  {
    path: '/practice',
    name: 'practice',
    component: () => import('../views/PracticeView.vue')
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/ProgressView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
