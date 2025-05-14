<template>
  <div class="dropdown-wrapper" ref="dropdown">
    <div class="dropdown-toggle" @click="toggleDropdown">
      <span class="material-icons">{{ icon }}</span>
      <span>{{ selectedLabel }}</span>
      <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span>
    </div>
    <div class="dropdown-list" v-if="isOpen">
      <div
        class="dropdown-item"
        v-for="option in options"
        :key="option.value"
        @click="select(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownSelect',
  props: {
    icon: String,
    options: Array,
    modelValue: [String, Number]
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    selectedLabel() {
      const found = this.options.find(opt => opt.value === this.modelValue)
      return found ? found.label : ''
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    select(option) {
      this.$emit('update:modelValue', option.value)
      this.isOpen = false
    },
    closeDropdown(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.isOpen = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown)
  }
}
</script>

<style scoped>
.dropdown-wrapper {
  position: relative;
  user-select: none;
  height: 100%;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  gap: 6px;
  background-color: white;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: 0;
  height: 100%;
}

.arrow {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #333;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
  z-index: 999;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-list::-webkit-scrollbar {
  width: 6px;
}

.dropdown-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
