import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/components/Login.vue'
import Dashboard from '@/components/Dashboard.vue'
import CreateUser from '@/views/CreateUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
    },
       {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
      {
    path: '/usuarios/crear',
    component: CreateUser,
  },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})
/*  PROTECCIÓN DE RUTAS */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Si NO hay token y NO está intentando ir al login
  if (!token && to.path !== '/') {
    next('/') // lo manda al login
  } 
  // Si ya tiene token y quiere ir al login
  else if (token && to.path === '/') {
    next('/dashboard') // lo manda al dashboard
  } 
  else {
    next() // deja pasar normalmente
  }
})

export default router
