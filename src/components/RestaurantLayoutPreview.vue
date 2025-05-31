<template>
  <div class="restaurant-layout-container">
    <div class="restaurant-grid">
      <div
        v-for="(cell, index) in 120"
        :key="index"
        class="grid-cell"
      >
        <div v-if="gridElements[index]" class="grid-item">
          <img
            :src="gridElements[index].image"
            class="placed-element"
            :style="{ transform: 'rotate(' + (gridElements[index].rotation || 0) + 'deg)' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  layout: Array,
  leftElements: Array,
  bottomElements: Array
})

function getElementByTypeId(typeId) {
  const allElements = [...props.leftElements, ...props.bottomElements]
  return allElements.find(el => el.id === typeId)
}

const gridElements = computed(() => {
  const grid = new Array(120).fill(null)
  props.layout.forEach(item => {
    const index = item.Y * 12 + item.X
    const element = getElementByTypeId(item.TypeId)
    grid[index] = {
      id: item.Id,
      typeId: item.TypeId,
      image: element?.image ?? '',
      rotation: item.Rotation,
      floor: item.Floor
    }
  })
  return grid
})
</script>

<style scoped>
.restaurant-grid {
  width: 624px;
  height: 520px;
  display: grid;
  grid-template-columns: repeat(12, 50px);
  grid-template-rows: repeat(10, 50px);
  gap: 0;
  border: 2px solid #aaa;
  background: none;
  border-radius: 2px;
}

.grid-cell {
  position: relative;
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
}

.placed-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
