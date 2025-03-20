import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TagView from '../views/TagView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import EditPostView from '../views/EditPostView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/add',
    name: 'add',
    component: CreatePostView
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: EditPostView
  },
  {
    path: '/tag/:tag',
    name: 'tag',
    component: TagView
  },
  {
    path: '/post/:title',
    name: 'post',
    component: PostDetailView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
