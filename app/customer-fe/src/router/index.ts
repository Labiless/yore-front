import { createRouter, createWebHistory } from 'vue-router'
import { getAuthSession } from '@/services/api.service';
import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import CreateTattoo from "@/pages/CreateTattoo.vue"
import Tattoos from '@/pages/Tattoos.vue';
import User from '@/pages/User.vue';
import Inks from '@/pages/Inks.vue';

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
      path: '/tattoos',
      name: 'tattoos',
      component: Tattoos,
      meta: { requiresAuth: true },
    },
    {
      path: '/tattoos/:tattooUuid',
      name: 'tattoo',
      component: Tattoos,
      meta: { requiresAuth: true },
    },
    {
      path: '/inks',
      name: 'inks',
      component: Inks,
      meta: { requiresAuth: true },
    },    
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: { requiresAuth: true },
    },
    {
      path: '/createtattoo/:tattooUuid?',
      name: 'createtattoo',
      component: CreateTattoo,
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

router.beforeEach(async (to, _from, next) => {
  const redirect = await getAuthSession().guardRoute(to);
  if (redirect) {
    next(redirect);
    return;
  }
  next();
})

export default router
