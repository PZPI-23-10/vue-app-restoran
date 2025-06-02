<template>
  <div class="modal-overlay" @click.self="emitClose">
    <div class="modal-window">
      <div class="modal-header">
        <h2>Конструктор ресторану: {{ restaurant.name }}</h2>
        <button class="close-btn" @click="emitClose">×</button>
      </div>

      <div class="modal-body">
        <div v-if="restaurantData.layout.length" class="restaurant-layout-container">
          <div class="layout-wrapper">
            <div class="restaurant-grid">
              <div
                v-for="(cell, index) in 120"
                :key="index"
                class="grid-cell"
              >
                <div v-if="restaurantData.layout[activeFloorIndex][index]" class="grid-item">
                  <img
                    :src="restaurantData.layout[activeFloorIndex][index].image"
                    alt="Элемент планировки"
                    class="placed-element"
                    :style="{ transform: 'rotate(' + (restaurantData.layout[activeFloorIndex][index].rotation || 0) + 'deg)' }"
                  />
                </div>
              </div>
            </div>

              <div class="floor-tabs">
                <button
                  v-for="(floor, index) in restaurantData.layout"
                  :key="index"
                  :class="{ active: index === activeFloorIndex }"
                  @click="switchFloor(index)"
                >
                  Поверх {{ index + 1 }}
                </button>
              </div>
            </div>
          </div>
        <div v-else>
        <p>Планування ресторану відсутнє.</p>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  restaurant: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

function emitClose() {
  emit('close')
}

const restaurantData = ref({
  layout: []
})
const activeFloorIndex = ref(0)

function prepareLayout() {
  if (!props.restaurant) return

  let parsedLayout

  try {
    if (typeof props.restaurant.layout === 'string') {
      parsedLayout = JSON.parse(props.restaurant.layout)
    } else {
      parsedLayout = props.restaurant.layout
    }
  } catch (e) {
    console.error('Ошибка парсинга layout:', e)
    parsedLayout = []
  }

  if (
    Array.isArray(parsedLayout) &&
    parsedLayout.length &&
    typeof parsedLayout[0] === 'object' &&
    'Floor' in parsedLayout[0]
  ) {
    const floorsMap = new Map()
    parsedLayout.forEach(item => {
      if (!floorsMap.has(item.Floor)) floorsMap.set(item.Floor, [])
      floorsMap.get(item.Floor).push(item)
    })

    const floorsArray = Array.from(floorsMap.values())
    restaurantData.value = {
      layout: floorsArray.map(floorData => convertLayoutToGrid(floorData))
    }
  } else if (Array.isArray(parsedLayout)) {
    restaurantData.value = {
      layout: parsedLayout.map(floorData => convertLayoutToGrid(floorData))
    }
  } else {
    restaurantData.value = {
      layout: [Array(120).fill(null)]
    }
  }
  activeFloorIndex.value = 0
}

function convertLayoutToGrid(layoutArray) {
  const grid = new Array(120).fill(null)
  layoutArray.forEach(item => {
    const index = item.Y * 12 + item.X
    const element = getElementByTypeId(item.TypeId)
    grid[index] = {
      id: item.Id,
      typeId: item.TypeId,
      image: element?.image || '',
      rotation: item.Rotation,
      floor: item.Floor
    }
  })
  return grid
}

const allElements = [
  { id: 1, title: 'Пряма стіна', image: '/images/wall.png' },
  { id: 2, title: 'Окружність', image: '/images/circle.png' },
  { id: 3, title: 'Стіна "Трикутник"', image: '/images/triangle.png' },
  { id: 4, title: 'Двері', image: '/images/door.png' },
  { id: 5, title: 'Вікна', image: '/images/window.png' },
  { id: 6, title: 'Місце на двох', image: '/images/tableForTwo.png' },
  { id: 7, title: 'Місце на багатьох', image: '/images/tableForMany.png' },
  { id: 8, title: 'Столи з диваном/кріслом', image: '/images/tableWithSofa.png' },
  { id: 9, title: 'Барна стійка', image: '/images/bar.png' },
  { id: 10, title: 'Сходи', image: '/images/stairs.png' }
]

function getElementByTypeId(typeId) {
  return allElements.find(el => el.id === typeId) || { image: '/images/placeholder.png' }
}

function switchFloor(index) {
  activeFloorIndex.value = index
}

onMounted(() => {
  prepareLayout()
})

watch(() => props.restaurant, () => {
  prepareLayout()
})
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-window {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  padding: 24px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  flex: 1;
  text-align: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  line-height: 1;
}

.modal-body {
  flex: 1;
}

.restaurant-layout-container {
  display: flex;
  justify-content: center; 
  width: 100%;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 0; 
  width: 100%; 
  max-width: 720px; 
  aspect-ratio: 12 / 10; 
}

.grid-cell {
  border: 1px solid #ccc; 
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  position: relative;
  width: 100%;
  height: 60px; 
}

.grid-item {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.floor-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap; 
  justify-content: center;
}

.floor-tabs button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
}


.floor-tabs button.active {
  background: #ff6600;
  color: white;
  border-color: #ff6600;
}

.layout-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px; 
  width: 100%;
}
</style>