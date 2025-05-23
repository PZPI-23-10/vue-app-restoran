<template>
  <div class="map-wrapper" :class="{ blurred: showLogin }">
    <div id="restaurant-map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'RestaurantMap',
  props: {
    showLogin: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const map = L.map('restaurant-map', {
      zoomControl: false
    }).setView([50.4501, 30.5236], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(map)

    const markers = [
      { name: 'Пузата хата', lat: 50.4501, lng: 30.5256 },
      { name: 'Італійська хата', lat: 50.4503, lng: 30.5280 },
      { name: 'Мексиканський кортель', lat: 50.4555, lng: 30.5250 }
    ]

    markers.forEach(({ name, lat, lng }) => {
      const icon = L.divIcon({
        className: 'material-marker',
        html: `<span class="material-icons">location_on</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })

      const marker = L.marker([lat, lng], { icon }).addTo(map).bindPopup(name)

      setTimeout(() => {
        const el = marker.getElement()
        if (el) {
          el.addEventListener('mouseenter', () => {
            const span = el.querySelector('.material-icons')
            span?.classList.add('hovered')
          })
          el.addEventListener('mouseleave', () => {
            const span = el.querySelector('.material-icons')
            span?.classList.remove('hovered')
          })
        }
      }, 0)
    })
  }
}
</script>

<style scoped>
#restaurant-map {
  height: 400px;
}

.map-wrapper {
  position: relative;
}
.map-wrapper.blurred::after {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.3);
  z-index: 1000;
  pointer-events: none;
}

.material-marker .material-icons {
  font-size: 30px;
  color: #f44336;
  transition: transform 0.2s ease, color 0.2s ease;
  user-select: none;
}

.material-marker .material-icons.hovered {
  transform: scale(1.6);
  color: #ff5722;
}
</style>
