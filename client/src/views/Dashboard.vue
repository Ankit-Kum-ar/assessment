<template>
  <div class="fade-in">
    <header class="mb-8">
      <h1 class="text-3xl font-bold font-heading">Dashboard</h1>
      <p class="text-base-content/70 mt-2">Monitor and manage your EV charging stations</p>
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Total Stations Card -->
      <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div class="card-body">
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-primary/20 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 class="card-title font-heading">Total Stations</h2>
              <p class="text-base-content/70">All registered stations</p>
            </div>
          </div>
          <p class="text-5xl font-bold text-center my-4">{{ stations.length }}</p>
          <div class="card-actions justify-end mt-2">
            <router-link to="/stations" class="btn btn-primary btn-sm">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Active Stations Card -->
      <div class="card bg-success/20 text-base-content shadow-xl hover:shadow-2xl transition-all duration-300 pulse-animation">
        <div class="card-body">
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-success/30 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 class="card-title font-heading">Active Stations</h2>
              <p class="text-base-content/70">Ready for charging</p>
            </div>
          </div>
          <p class="text-5xl font-bold text-center my-4">{{ activeStations.length }}</p>
          <div class="card-actions justify-end mt-2">
            <router-link to="/map" class="btn btn-success btn-sm">
              View on Map
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Inactive Stations Card -->
      <div class="card bg-warning/20 text-base-content shadow-xl hover:shadow-2xl transition-all duration-300">
        <div class="card-body">
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-warning/30 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 class="card-title font-heading">Maintenance</h2>
              <p class="text-base-content/70">Inactive or in maintenance</p>
            </div>
          </div>
          <p class="text-5xl font-bold text-center my-4">{{ inactiveStations.length }}</p>
          <div class="card-actions justify-end mt-2">
            <router-link to="/stations" class="btn btn-warning btn-sm">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center mt-12">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>
    
    <!-- Recent Stations -->
    <div v-else class="mt-12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold font-heading">Recent Stations</h2>
        <router-link to="/stations" class="btn btn-ghost btn-sm">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
      
      <div class="overflow-x-auto rounded-lg shadow-lg">
        <table class="table table-zebra w-full">
          <thead class="bg-base-300 text-base-content">
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Power Output</th>
              <th>Connector Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="station in recentStations" :key="station._id" class="hover:bg-base-300/50 transition-colors duration-200">
              <td class="font-medium">{{ station.name }}</td>
              <td>{{ station.location.address || `${station.location.latitude.toFixed(4)}, ${station.location.longitude.toFixed(4)}` }}</td>
              <td>
                <div :class="`badge ${getStatusBadgeClass(station.status)}`">
                  {{ station.status }}
                </div>
              </td>
              <td>{{ station.powerOutput }} kW</td>
              <td>
                <div class="badge badge-outline">{{ station.connectorType }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-8 text-center" v-if="recentStations.length === 0">
        <div class="bg-base-300 p-8 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p class="text-base-content/70 mt-4 mb-6">No charging stations found. Add some to get started!</p>
          <router-link to="/stations" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Station
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStationStore } from '../stores/stationStore'

const stationStore = useStationStore()
const loading = ref(true)

onMounted(async () => {
  try {
    await stationStore.fetchStations()
  } catch (error) {
    console.error('Error fetching stations:', error)
  } finally {
    loading.value = false
  }
})

const stations = computed(() => stationStore.stations)

const activeStations = computed(() => 
  stations.value.filter(station => station.status === 'Active')
)

const inactiveStations = computed(() => 
  stations.value.filter(station => station.status !== 'Active')
)

const recentStations = computed(() => {
  // Sort by creation date (newest first) and get the first 5
  return [...stations.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Active':
      return 'badge-success'
    case 'Inactive':
      return 'badge-error'
    case 'Maintenance':
      return 'badge-warning'
    default:
      return 'badge-info'
  }
}
</script>
