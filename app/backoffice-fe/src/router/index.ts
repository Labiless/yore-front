// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Login from '@/pages/Login.vue';
import LoadBatch from '@/pages/LoadBatch.vue';
import Home from '@/pages/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/loadbatch',
      name: 'loadBatch',
      component: LoadBatch,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: to => {
        return { path: '/', name: 'home', component: Home }
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.path !== '/login' && !authStore.isAuthenticated) {
    next('/login');
  }
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/');
  }
  else {
    next();
  }
})

export default router
