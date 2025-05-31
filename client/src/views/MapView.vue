<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Map View</h1>
    
    <!-- Filters -->
    <div class="bg-base-100 shadow-md rounded-lg p-4 mb-6">
      <h3 class="font-semibold mb-3">Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Status</span>
          </label>
          <select v-model="filters.status" class="select select-bordered w-full" @change="applyFilters">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Connector Type</span>
          </label>
          <select v-model="filters.connectorType" class="select select-bordered w-full" @change="applyFilters">
            <option value="">All Types</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="CCS">CCS</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Tesla">Tesla</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Min Power Output (kW)</span>
          </label>
          <input 
            type="number" 
            v-model="filters.minPowerOutput" 
            class="input input-bordered w-full" 
            placeholder="Minimum kW"
            @input="applyFilters"
          />
        </div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center my-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    
    <!-- Map Container -->
    <div v-else>
      <div id="map" class="h-[600px] rounded-lg shadow-lg"></div>
      
      <!-- Station details modal -->
      <div class="modal" :class="{ 'modal-open': selectedStation !== null }">
        <div class="modal-box bg-base-200 relative mx-auto my-16">
          <h3 class="font-bold text-lg font-heading" v-if="selectedStation">{{ selectedStation.name }}</h3>
          <div v-if="selectedStation" class="py-4">
            <div class="grid grid-cols-2 gap-2">
              <div class="font-semibold">Status:</div>
              <div>
                <span :class="`badge ${getStatusBadgeClass(selectedStation.status)}`">
                  {{ selectedStation.status }}
                </span>
              </div>
              
              <div class="font-semibold">Power Output:</div>
              <div>{{ selectedStation.powerOutput }} kW</div>
              
              <div class="font-semibold">Connector Type:</div>
              <div>{{ selectedStation.connectorType }}</div>
              
              <div class="font-semibold">Address:</div>
              <div>{{ selectedStation.location.address || 'N/A' }}</div>
              
              <div class="font-semibold">Coordinates:</div>
              <div>{{ selectedStation.location.latitude.toFixed(6) }}, {{ selectedStation.location.longitude.toFixed(6) }}</div>
            </div>
          </div>
          <div class="modal-action">
            <button @click="selectedStation = null" class="btn btn-primary">Close</button>
          </div>
        </div>
        <label class="modal-backdrop backdrop-blur-sm" @click="selectedStation = null"></label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useStationStore } from '../stores/stationStore'
import 'leaflet/dist/leaflet.css'

const stationStore = useStationStore()
const loading = computed(() => stationStore.loading)
const filteredStations = computed(() => stationStore.filteredStations)
const selectedStation = ref(null)
const map = ref(null)
const markers = ref([])

const filters = ref({
  status: '',
  connectorType: '',
  minPowerOutput: ''
})

onMounted(async () => {
  try {
    await stationStore.fetchStations()
    
    // Import Leaflet dynamically to avoid SSR issues
    const L = await import('leaflet').then(module => module.default)
    
    // Fix marker icon issue
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
    })
    
    // Initialize map
    map.value = L.map('map').setView([0, 0], 2)
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value)
    
    // Add markers for each station
    addMarkersToMap(L)
    
    // If we have stations, fit the map to show all of them
    if (filteredStations.value.length > 0) {
      fitMapToBounds(L)
    }
  } catch (error) {
    console.error('Error setting up map:', error)
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

// Watch for changes in filtered stations to update markers
watch(filteredStations, async () => {
  if (map.value) {
    const L = await import('leaflet').then(module => module.default)
    clearMarkers()
    addMarkersToMap(L)
    fitMapToBounds(L)
  }
})

const addMarkersToMap = (L) => {
  markers.value = []
  
  filteredStations.value.forEach(station => {
    // Create marker with custom color based on status
    const markerColor = getMarkerColor(station.status)
    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${markerColor}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    })
    
    const marker = L.marker([station.location.latitude, station.location.longitude], {
      icon: markerIcon,
      title: station.name
    }).addTo(map.value)
    
    // Add popup with basic info
    marker.bindPopup(`
      <strong>${station.name}</strong><br>
      Status: ${station.status}<br>
      Power: ${station.powerOutput} kW<br>
      <button class="popup-button">View Details</button>
    `)
    
    // Add click handler to show details modal
    marker.on('popupopen', (e) => {
      setTimeout(() => {
        const button = document.querySelector('.popup-button')
        if (button) {
          button.addEventListener('click', () => {
            selectedStation.value = station
            marker.closePopup()
          })
        }
      }, 0)
    })
    
    markers.value.push(marker)
  })
}

const clearMarkers = () => {
  markers.value.forEach(marker => {
    marker.remove()
  })
  markers.value = []
}

const fitMapToBounds = (L) => {
  if (filteredStations.value.length > 0) {
    const bounds = L.latLngBounds(
      filteredStations.value.map(station => [
        station.location.latitude,
        station.location.longitude
      ])
    )
    map.value.fitBounds(bounds, { padding: [50, 50] })
  }
}

const getMarkerColor = (status) => {
  switch (status) {
    case 'Active':
      return '#36D399' // success/green
    case 'Inactive':
      return '#F87272' // error/red
    case 'Maintenance':
      return '#FBBD23' // warning/yellow
    default:
      return '#3ABFF8' // info/blue
  }
}

const applyFilters = () => {
  stationStore.applyLocalFilters(filters.value)
}

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

<style>
.popup-button {
  background-color: #570DF8;
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
  font-size: 12px;
}

.popup-button:hover {
  background-color: #4506cb;
}
</style>
