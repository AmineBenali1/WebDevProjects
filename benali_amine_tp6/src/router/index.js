import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreatePostView from '../views/CreatePostView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import EditPostView from '../views/EditPostView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/create',
    name: 'create-post',
    component: CreatePostView
  },
  {
    path: '/post/:id',
    name: 'post-detail',
    component: PostDetailView
  },
  {
    path: '/edit/:id',
    name: 'edit-post',
    component: EditPostView
  },
  {
    path: '/tag/:tag',
    name: 'tag',
    component: HomeView
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
