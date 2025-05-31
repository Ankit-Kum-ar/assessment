import { defineStore } from 'pinia'
import api from '../utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    loading: false,
    error: null
  }),
  
  actions: {
    // Register user
    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/v1/auth/register', userData)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        this.user = response.data.user
        this.isAuthenticated = true
        this.loading = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        this.loading = false
        throw error
      }
    },
    
    // Login user
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/v1/auth/login', credentials)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        this.user = response.data.user
        this.isAuthenticated = true
        this.loading = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        this.loading = false
        throw error
      }
    },
    
    // Logout user
    async logout() {
      this.loading = true
      this.error = null
      try {
        await api.post('/api/v1/auth/logout')
        localStorage.removeItem('user')
        this.user = null
        this.isAuthenticated = false
        this.loading = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Logout failed'
        this.loading = false
        // Still remove user from state even if API call fails
        localStorage.removeItem('user')
        this.user = null
        this.isAuthenticated = false
        throw error
      }
    },
    
    // Clear errors
    clearErrors() {
      this.error = null
    }
  }
})
