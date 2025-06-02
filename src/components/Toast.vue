<template>
  <div v-if="visible" :class="['toast', type]">
    {{ message }}
  </div>
</template>

<script setup>
import { message, type, visible } from '../services/toast.js'
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.toast.success { background-color: #4caf50; }
.toast.error { background-color: #f44336; }
.toast.info { background-color: #2196f3; }
</style>
