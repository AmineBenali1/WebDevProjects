import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatroomView from '../views/ChatroomView.vue'
import ProfileView from '../views/ProfileView.vue'
import DiscussionView from '../views/DiscussionView.vue'
import { projectAuth } from '../Firebase/Config'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/chatroom',
    name: 'Chatroom',
    component: ChatroomView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/discussion/:id',
    name: 'discussion',
    component: DiscussionView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Attendre que l'état d'authentification soit déterminé
  await new Promise((resolve) => {
    const unsubscribe = projectAuth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })

  if (to.meta.requiresAuth && !projectAuth.currentUser) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
