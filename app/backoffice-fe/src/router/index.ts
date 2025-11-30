// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Login from '@/pages/Login.vue';
import LoadBatch from '@/pages/LoadBatch.vue';
import Home from '@/pages/Home.vue';
import Warehouse from '@/pages/Warehouse.vue';
import CreateLabels from '@/pages/CreateLabels.vue';
import Labels from '@/pages/Labels.vue';
import Users from '@/pages/Users.vue';
import InkBatch from '@/pages/InkBatch.vue';
import Ink from '@/pages/Ink.vue';
import LabelBatch from '@/pages/LabelBatch.vue';
import CreateUser from '@/pages/CreateUser.vue';

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
      path: '/warehouse',
      name: 'warehouse',
      component: Warehouse,
      meta: { requiresAuth: true },
    },
    {
      path: '/warehouse/:batchUuid',
      name: 'inkBatch',
      component: InkBatch,
      meta: { requiresAuth: true },
    },
    {
      path: '/warehouse/:batchUuid/:inkUuid',
      name: 'ink',
      component: Ink,
      meta: { requiresAuth: true },
    },
    {
      path: '/createlabels',
      name: 'createlabels',
      component: CreateLabels,
      meta: { requiresAuth: true },
    },
    {
      path: '/labels',
      name: 'labels',
      component: Labels,
      meta: { requiresAuth: true },
    },
    {
      path: '/labels/:labelsUuid',
      name: 'labelBatch',
      component: Labels,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: { requiresAuth: true },
    },
    {
      path: '/createuser',
      name: 'CreateUser',
      component: CreateUser,
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
