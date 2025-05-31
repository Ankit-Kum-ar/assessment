<template>
  <div class="navbar bg-base-300 text-base-content shadow-xl sticky top-0 z-40 border-b border-primary/20">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
          <li><router-link to="/dashboard" class="font-medium">Dashboard</router-link></li>
          <li><router-link to="/stations" class="font-medium">Stations</router-link></li>
          <li><router-link to="/map" class="font-medium">Map View</router-link></li>
        </ul>
      </div>
      <router-link to="/dashboard" class="btn btn-ghost normal-case text-xl">
        <div class="bg-primary/10 p-2 rounded-full mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="font-heading"></span>
      </router-link>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 rounded-box bg-base-200/50">
        <li><router-link to="/dashboard" class="font-medium mx-1 rounded-lg">Dashboard</router-link></li>
        <li><router-link to="/stations" class="font-medium mx-1 rounded-lg">Stations</router-link></li>
        <li><router-link to="/map" class="font-medium mx-1 rounded-lg">Map View</router-link></li>
      </ul>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar border-2 border-primary/30 hover:border-primary transition-all">
          <div class="avatar-wrapper w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center shadow-md">
            <span class="text-lg font-bold flex items-center justify-center h-full leading-none transform -translate-y-px">{{ userInitials }}</span>
          </div>
        </label>
        <ul tabindex="0" class="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-200 rounded-box w-52 border border-primary/10">
          <li class="p-3 text-sm opacity-75 text-center">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center mx-auto mb-2">
              <span class="text-xl font-bold flex items-center justify-center h-full leading-none">{{ userInitials }}</span>
            </div>
            Signed in as <span class="font-bold block mt-1">{{ username }}</span>
          </li>
          <div class="divider my-0"></div>
          <li>
            <a @click="handleLogout" class="font-medium hover:bg-error/10 hover:text-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = computed(() => {
  return authStore.user?.username || 'User'
})

const userInitials = computed(() => {
  const name = authStore.user?.username || 'U'
  return name.charAt(0).toUpperCase()
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
