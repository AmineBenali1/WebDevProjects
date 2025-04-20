import { createRouter, createWebHashHistory } from 'vue-router'
import Library from '../components/Library.vue'
import BookDetails from '../components/BookDetails.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Library
  },
  {
    path: '/book/:id',
    name: 'book-details',
    component: BookDetails
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
