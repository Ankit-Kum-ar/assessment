<template>
  <div class="min-h-screen bg-base-200">
    <Navbar v-if="isAuthenticated" />
    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
    <Toast :message="errorMessage" :type="'error'" v-if="errorMessage" @close="clearErrors" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import { useStationStore } from './stores/stationStore'
import Navbar from './components/Navbar.vue'
import Toast from './components/Toast.vue'

const authStore = useAuthStore()
const stationStore = useStationStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const errorMessage = computed(() => {
  return authStore.error || stationStore.error
})

const clearErrors = () => {
  authStore.clearErrors()
  stationStore.clearErrors()
}

// Set up axios interceptor for authentication
import axios from 'axios'

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized is returned, redirect to login
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
</script>
