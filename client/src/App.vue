<template>
  <div class="min-h-screen bg-base-200">
    <Navbar v-if="showNavbar" />
    <main class="container mx-auto px-4 py-8">
      <router-view v-if="!authStore.loading || isAuthPage" />
      <div v-else class="flex justify-center items-center h-[70vh]">
        <div class="loading loading-spinner loading-lg text-primary"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const authStore = useAuthStore()

const showNavbar = computed(() => {
  // Don't show navbar on login and register pages
  return !['Login', 'Register'].includes(route.name)
})

const isAuthPage = computed(() => {
  return ['Login', 'Register'].includes(route.name)
})

onMounted(async () => {
  // We'll handle initialization in the router guard instead
  // This avoids duplicate initialization calls
})
</script>
