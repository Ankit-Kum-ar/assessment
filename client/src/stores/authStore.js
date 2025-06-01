import { defineStore } from 'pinia'
import api from '../utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  
  actions: {
    // Initialize auth state from user session
    async initAuth() {
      try {
        // Check if user is authenticated by making a request to a protected endpoint
        const response = await api.get('/api/v1/auth/me')
        if (response.data && response.data.user) {
          this.user = response.data.user
          this.isAuthenticated = true
        }
      } catch (error) {
        // If request fails, user is not authenticated
        this.user = null
        this.isAuthenticated = false
      }
    },
    
    // Register user
    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/v1/auth/register', userData)
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
        this.user = null
        this.isAuthenticated = false
        this.loading = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Logout failed'
        this.loading = false
        // Still remove user from state even if API call fails
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
