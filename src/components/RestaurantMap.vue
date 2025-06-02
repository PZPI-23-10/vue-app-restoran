<template>
  <div class="map-wrapper" :class="{ blurred: showLogin }">
    <div class="map-background">
      <div ref="mapContainer" style="height: 100%; width: 100%;"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getAllRestaurants } from '../services/restaurantService'
import { cityCoords } from '../services/cityCoords'

const props = defineProps({
  selectedCity: String,
  showLogin: Boolean
})

const emit = defineEmits(['restaurantsVisible'])

const map = ref(null)
const mapContainer = ref(null)
const markers = ref([])
const allRestaurants = ref([])

function getCoordsByCity(cityName) {
  for (const region in cityCoords) {
    if (cityCoords[region][cityName]) {
      return cityCoords[region][cityName]
    }
  }
  return null
}
onMounted(async () => {
  const data = await getAllRestaurants(10)
  allRestaurants.value = data

  if (!mapContainer.value) {
    console.error('Map container не готов!')
    return
  }

  const startCoords = getCoordsByCity(props.selectedCity) || [50.4501, 30.5234]

  map.value = L.map(mapContainer.value, { zoomControl: false }).setView(startCoords, 8)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ''
  }).addTo(map.value)

  map.value.on('moveend', updateVisibleRestaurants)

  renderMarkers()
})


function renderMarkers() {
  markers.value.forEach(m => map.value.removeLayer(m))
  markers.value = []

  allRestaurants.value.forEach(restaurant => {
    const lat = parseFloat(restaurant.latitude)
    const lng = parseFloat(restaurant.longitude)

    if (!isNaN(lat) && !isNaN(lng)) {
      const icon = L.divIcon({
        className: 'material-marker',
        html: `<span class="material-icons">location_on</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })

      let photoHtml = ''
      if (restaurant.photoUrl) {
        photoHtml = `<img src="${restaurant.photoUrl}" alt="Фото ресторану" style="width:160px; height:100px; object-fit:cover; border-radius:8px;" />`
      }

      const popupContent = `
        <div style="text-align:center; max-width:180px;">
          <div style="font-weight:bold; font-size:16px; margin-bottom: 8px;">${restaurant.name}</div>
          ${photoHtml}
          <div style="font-size:12px; margin-top: 6px;">${restaurant.city}, вул. ${restaurant.street}</div>
        </div>
      `

      const marker = L.marker([lat, lng], { icon })
        .addTo(map.value)
        .bindPopup(popupContent)

      markers.value.push(marker)
    }
  })

  updateVisibleRestaurants()
}

function updateVisibleRestaurants() {
  if (!map.value) return
  const bounds = map.value.getBounds()

  const visible = allRestaurants.value.filter(r => {
    const lat = parseFloat(r.latitude)
    const lng = parseFloat(r.longitude)
    return !isNaN(lat) && !isNaN(lng) && bounds.contains([lat, lng])
  })

  emit('restaurantsVisible', visible)
}

watch(() => props.selectedCity, (newCity) => {
  const coords = getCoordsByCity(newCity)
  if (coords && map.value) {
    map.value.setView(coords, 13)
    updateVisibleRestaurants()
  }
})
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}
.map-background {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
