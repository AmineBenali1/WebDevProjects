import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import JobDetail from '../views/JobDetail.vue'
import JobForm from '../views/JobForm.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: JobDetail
  },
  {
    path: '/add-job',
    name: 'AddJob',
    component: JobForm
  },
  {
    path: '/edit-job/:id',
    name: 'EditJob',
    component: JobForm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
