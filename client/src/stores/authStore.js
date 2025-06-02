import { defineStore } from 'pinia'
import api from '../utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false
  }),
  
  actions: {
    // Initialize auth state from user session
    async initAuth() {
      if (this.initialized) return;
      
      this.loading = true;
      try {
        // Check if user is authenticated by making a request to a protected endpoint
        const response = await api.get('/api/v1/auth/me');
        console.log('Auth response:', response.data);
        if (response.data && response.data.user) {
          this.user = response.data.user;
          this.isAuthenticated = true;
        }
      } catch (error) {
        // If request fails, user is not authenticated
        this.user = null;
        this.isAuthenticated = false;
        // Don't throw error here, just log it
        console.log('Not authenticated:', error.message);
      } finally {
        this.loading = false;
        this.initialized = true;
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
        
        // Store token in localStorage as backup authentication method
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token)
        }
        
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
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Always clear state regardless of API success
        this.user = null
        this.isAuthenticated = false
        this.loading = false
        localStorage.removeItem('auth_token') // Clear token from localStorage
      }
    },
    
    // Clear errors
    clearErrors() {
      this.error = null
    }
  }
})
