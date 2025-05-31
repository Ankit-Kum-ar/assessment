import { defineStore } from 'pinia'
import api from '../utils/api'

export const useStationStore = defineStore('station', {
  state: () => ({
    stations: [],
    filteredStations: [],
    currentStation: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      connectorType: '',
      minPowerOutput: ''
    }
  }),
  
  actions: {
    // Fetch all charging stations
    async fetchStations() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/v1/stations')
        this.stations = response.data.data
        this.filteredStations = response.data.data
        this.loading = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch stations'
        this.loading = false
        throw error
      }
    },
    
    // Fetch stations with filters
    async fetchStationsWithFilters(filters) {
      this.loading = true
      this.error = null
      try {
        const params = {}
        if (filters.status) params.status = filters.status
        if (filters.connectorType) params.connectorType = filters.connectorType
        if (filters.minPowerOutput) params.powerOutput = filters.minPowerOutput
        
        const response = await api.get('/api/v1/stations', { params })
        this.stations = response.data.data
        this.filteredStations = response.data.data
        this.filters = filters
        this.loading = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch stations with filters'
        this.loading = false
        throw error
      }
    },
    
    // Create a new station
    async createStation(stationData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/v1/stations', stationData)
        this.stations.push(response.data.data)
        this.filteredStations.push(response.data.data)
        this.loading = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create station'
        this.loading = false
        throw error
      }
    },
    
    // Update a station
    async updateStation(id, stationData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/api/v1/stations/${id}`, stationData)
        
        // Update in stations array
        const stationIndex = this.stations.findIndex(station => station._id === id)
        if (stationIndex !== -1) {
          this.stations[stationIndex] = response.data.data
        }
        
        // Update in filteredStations array
        const filteredIndex = this.filteredStations.findIndex(station => station._id === id)
        if (filteredIndex !== -1) {
          this.filteredStations[filteredIndex] = response.data.data
        }
        
        this.loading = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update station'
        this.loading = false
        throw error
      }
    },
    
    // Delete a station
    async deleteStation(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/api/v1/stations/${id}`)
        
        // Remove from stations array
        this.stations = this.stations.filter(station => station._id !== id)
        
        // Remove from filteredStations array
        this.filteredStations = this.filteredStations.filter(station => station._id !== id)
        
        this.loading = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete station'
        this.loading = false
        throw error
      }
    },
    
    // Get a station by ID
    async getStationById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/api/v1/stations/${id}`)
        this.currentStation = response.data.data
        this.loading = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to get station'
        this.loading = false
        throw error
      }
    },
    
    // Set current station (for editing)
    setCurrentStation(station) {
      this.currentStation = station
    },
    
    // Clear current station
    clearCurrentStation() {
      this.currentStation = null
    },
    
    // Apply local filters (without API call)
    applyLocalFilters(filters) {
      this.filters = filters
      
      this.filteredStations = this.stations.filter(station => {
        // Filter by status
        if (filters.status && station.status !== filters.status) {
          return false
        }
        // Filter by connector type
        if (filters.connectorType && station.connectorType !== filters.connectorType) {
          return false
        }
        // Filter by power output
        if (filters.minPowerOutput && station.powerOutput < parseFloat(filters.minPowerOutput)) {
          return false
        }
        return true
      })
    },
    
    // Clear errors
    clearErrors() {
      this.error = null
    }
  }
})
