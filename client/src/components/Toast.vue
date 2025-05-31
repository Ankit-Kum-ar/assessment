<template>
  <div class="toast toast-top toast-end z-50">
    <div :class="`alert ${typeClass}`">
      <span>{{ message }}</span>
      <button @click="$emit('close')" class="btn btn-sm btn-circle">✕</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  },
  duration: {
    type: Number,
    default: 5000
  }
})

defineEmits(['close'])

const typeClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'alert-success'
    case 'error':
      return 'alert-error'
    case 'warning':
      return 'alert-warning'
    default:
      return 'alert-info'
  }
})
</script>
