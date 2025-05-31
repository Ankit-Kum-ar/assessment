<template>
  <div class="min-h-screen py-8 px-4 relative">
    <div class="bg-gradient-login"></div>
    <div class="card w-full max-w-lg mx-auto bg-base-100/90 backdrop-blur-sm shadow-2xl border border-primary/10">
      <div class="card-body p-8">
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent p-1">
            <div class="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <h2 class="card-title text-2xl font-bold text-center font-heading mb-2">Welcome Back</h2>
        <p class="text-center text-base-content/70 mb-6">Sign in to manage your EV charging stations</p>
        
        <form @submit.prevent="handleLogin">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input 
              type="email" 
              v-model="email" 
              placeholder="your@email.com" 
              class="input input-bordered input-primary bg-base-200/50" 
              required
            />
          </div>
          
          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="Password" 
                class="input input-bordered input-primary bg-base-200/50 w-full" 
                required
              />
              <button 
                type="button" 
                @click="togglePasswordVisibility" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary shadow-md"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </div>
        </form>
        
        <div class="divider my-6">OR</div>
        
        <div class="text-center">
          <p class="mb-2 text-base-content/70">Don't have an account?</p>
          <router-link to="/register" class="btn btn-outline btn-primary btn-block shadow-sm">Create Account</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const loading = computed(() => authStore.loading)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
