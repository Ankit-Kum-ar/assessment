<template>
  <div class="fade-in">
    <header class="flex flex-col md:flex-row justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold font-heading">Charging Stations</h1>
        <p class="text-base-content/70 mt-1">Manage your network of EV charging points</p>
      </div>
      <button @click="openModal" class="btn btn-primary mt-4 md:mt-0 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Station
      </button>
    </header>
    
    <!-- Filters -->
    <div class="bg-base-100 shadow-xl rounded-lg p-6 mb-8">
      <div class="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 class="font-semibold font-heading">Filters</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Status</span>
          </label>
          <select v-model="filters.status" class="select select-bordered select-primary bg-base-200 w-full" @change="applyFilters">
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
          <select v-model="filters.connectorType" class="select select-bordered select-primary bg-base-200 w-full" @change="applyFilters">
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
            class="input input-bordered input-primary bg-base-200 w-full" 
            placeholder="Minimum kW"
            @input="applyFilters"
          />
        </div>
      </div>
      
      <div class="flex justify-end mt-4">
        <button @click="clearFilters" class="btn btn-ghost btn-sm gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </button>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center my-16">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>
    
    <!-- Stations list -->
    <div v-else>
      <div class="overflow-x-auto rounded-lg shadow-xl">
        <table class="table table-zebra w-full">
          <thead class="bg-base-300 text-base-content">
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Power Output</th>
              <th>Connector Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="station in filteredStations" :key="station._id" class="hover:bg-base-300/50 transition-colors duration-200">
              <td class="font-medium">{{ station.name }}</td>
              <td>{{ station.location.address || `${station.location.latitude.toFixed(4)}, ${station.location.longitude.toFixed(4)}` }}</td>
              <td>
                <div :class="`badge ${getStatusBadgeClass(station.status)} gap-1`">
                  <span v-if="station.status === 'Active'" class="w-2 h-2 bg-current rounded-full"></span>
                  {{ station.status }}
                </div>
              </td>
              <td>{{ station.powerOutput }} kW</td>
              <td>
                <div class="badge badge-outline">{{ station.connectorType }}</div>
              </td>
              <td>
                <div class="flex space-x-2">
                  <button @click="editStation(station)" class="btn btn-sm btn-info btn-square">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(station._id)" class="btn btn-sm btn-error btn-square">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-10 text-center" v-if="filteredStations.length === 0">
        <div class="bg-base-300 p-8 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-base-content/70 mt-4 mb-6">No charging stations found matching your filters.</p>
          <button @click="clearFilters" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Station Modal -->
    <div class="modal" :class="{ 'modal-open': isModalOpen }">
      <div class="modal-box max-w-3xl bg-base-200 relative mx-auto my-16">
        <h3 class="font-bold text-lg font-heading">{{ isEditing ? 'Edit Charging Station' : 'Add New Charging Station' }}</h3>
        <p class="text-sm text-base-content/70 mt-1 mb-4">{{ isEditing ? 'Update the details of your charging station' : 'Fill out the details to add a new charging station to your network' }}</p>
        
        <form @submit.prevent="saveStation" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Name</span>
              </label>
              <input 
                type="text" 
                v-model="stationForm.name" 
                class="input input-bordered input-primary bg-base-300" 
                required
                placeholder="Station Name"
              />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Status</span>
              </label>
              <select v-model="stationForm.status" class="select select-bordered select-primary bg-base-300" required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Latitude</span>
              </label>
              <input 
                type="number" 
                v-model="stationForm.location.latitude" 
                class="input input-bordered input-primary bg-base-300" 
                required
                step="0.000001"
                min="-90"
                max="90"
                placeholder="Latitude"
              />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Longitude</span>
              </label>
              <input 
                type="number" 
                v-model="stationForm.location.longitude" 
                class="input input-bordered input-primary bg-base-300" 
                required
                step="0.000001"
                min="-180"
                max="180"
                placeholder="Longitude"
              />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Address</span>
              </label>
              <input 
                type="text" 
                v-model="stationForm.location.address" 
                class="input input-bordered input-primary bg-base-300" 
                placeholder="Address (optional)"
              />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Power Output (kW)</span>
              </label>
              <input 
                type="number" 
                v-model="stationForm.powerOutput" 
                class="input input-bordered input-primary bg-base-300" 
                required
                min="0"
                step="0.1"
                placeholder="Power in kW"
              />
            </div>
            
            <div class="form-control md:col-span-2">
              <label class="label">
                <span class="label-text">Connector Type</span>
              </label>
              <select v-model="stationForm.connectorType" class="select select-bordered select-primary bg-base-300" required>
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="Tesla">Tesla</option>
              </select>
            </div>
          </div>
          
          <div class="modal-action mt-8">
            <button type="button" @click="closeModal" class="btn btn-ghost">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
      <label class="modal-backdrop backdrop-blur-sm" @click="closeModal"></label>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'modal-open': isDeleteModalOpen }">
      <div class="modal-box bg-base-200 relative mx-auto my-16">
        <h3 class="font-bold text-lg font-heading text-error">Confirm Deletion</h3>
        <p class="py-4">Are you sure you want to delete this charging station? This action cannot be undone.</p>
        <div class="modal-action">
          <button @click="isDeleteModalOpen = false" class="btn btn-ghost">Cancel</button>
          <button @click="deleteStation" class="btn btn-error" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
            {{ loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
      <label class="modal-backdrop backdrop-blur-sm" @click="isDeleteModalOpen = false"></label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStationStore } from '../stores/stationStore'

const stationStore = useStationStore()

const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const stationIdToDelete = ref(null)

const stationForm = ref({
  name: '',
  location: {
    latitude: '',
    longitude: '',
    address: ''
  },
  status: 'Active',
  powerOutput: '',
  connectorType: 'Type 2'
})

const filters = ref({
  status: '',
  connectorType: '',
  minPowerOutput: ''
})

const loading = computed(() => stationStore.loading)
const filteredStations = computed(() => stationStore.filteredStations)

onMounted(async () => {
  try {
    await stationStore.fetchStations()
  } catch (error) {
    console.error('Error fetching stations:', error)
  }
})

const openModal = () => {
  isEditing.value = false
  resetForm()
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  stationForm.value = {
    name: '',
    location: {
      latitude: '',
      longitude: '',
      address: ''
    },
    status: 'Active',
    powerOutput: '',
    connectorType: 'Type 2'
  }
}

const editStation = (station) => {
  isEditing.value = true
  stationForm.value = {
    name: station.name,
    location: {
      latitude: station.location.latitude,
      longitude: station.location.longitude,
      address: station.location.address || ''
    },
    status: station.status,
    powerOutput: station.powerOutput,
    connectorType: station.connectorType
  }
  stationStore.setCurrentStation(station)
  isModalOpen.value = true
}

const saveStation = async () => {
  try {
    if (isEditing.value) {
      const currentStation = stationStore.currentStation
      await stationStore.updateStation(currentStation._id, stationForm.value)
    } else {
      await stationStore.createStation(stationForm.value)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving station:', error)
  }
}

const confirmDelete = (id) => {
  stationIdToDelete.value = id
  isDeleteModalOpen.value = true
}

const deleteStation = async () => {
  try {
    await stationStore.deleteStation(stationIdToDelete.value)
    isDeleteModalOpen.value = false
    stationIdToDelete.value = null
  } catch (error) {
    console.error('Error deleting station:', error)
  }
}

const applyFilters = () => {
  stationStore.applyLocalFilters(filters.value)
}

const clearFilters = () => {
  filters.value = {
    status: '',
    connectorType: '',
    minPowerOutput: ''
  }
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
