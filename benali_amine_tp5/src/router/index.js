import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import JobDetails from '../components/jobDetails.vue'
import AddJob from '../components/addJob.vue'
import EditJob from '../components/editJob.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/job/:id',
    name: 'JobDetails',
    component: JobDetails
  },
  {
    path: '/add',
    name: 'AddJob',
    component: AddJob
  },
  {
    path: '/edit-job/:id',
    name: 'EditJob',
    component: EditJob
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
