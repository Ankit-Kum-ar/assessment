import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import ChargingStations from '../views/ChargingStations.vue'
import MapView from '../views/MapView.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/stations',
    name: 'ChargingStations',
    component: ChargingStations,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'MapView',
    component: MapView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // We need to get the store inside the navigation guard function
  // instead of at the module level since router is created before pinia
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  
  // Routes requiring auth
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } 
  // Routes requiring guest (non-authenticated)
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  }
  else {
    next()
  }
})

export default router
