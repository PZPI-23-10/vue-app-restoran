<template>
  <div class="map-wrapper" :class="{ blurred: showLogin }">
    <div id="restaurant-map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 🔹 Винесено за межі export, щоб мати доступ і в mounted, і в watch
const cityCoords = {
  'Київ': [50.4501, 30.5236],
  'Харків': [49.9935, 36.2304],
  'Львів': [49.8397, 24.0297],
  'Дрогобич': [49.3500, 23.5000],
  'Одеса': [46.4825, 30.7233],
  'Ізмаїл': [45.3519, 28.8370]
}
export default {
  name: 'RestaurantMap',
  props: {
    showLogin: {
      type: Boolean,
      default: false
    },
    selectedCity: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      map: null,
      markers: [],
      minZoomToShowMarkers: 13
    }
  },
  mounted() {
    const initialCoords = cityCoords[this.selectedCity] || [50.4501, 30.5236]

    this.map = L.map('restaurant-map', {
      zoomControl: false
    }).setView(initialCoords, 13) // Початковий зум менший, ніж пороговий

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(this.map)

    this.createMarkers()

    this.map.on('zoomend', this.toggleMarkersVisibility)
    this.toggleMarkersVisibility() // Перевірити одразу
  },
  methods: {
    createMarkers() {
      const markerData = [
        { name: 'Пузата хата', lat: 50.4501, lng: 30.5256 },
        { name: 'Італійська хата', lat: 50.4503, lng: 30.5280 },
        { name: 'Мексиканський кортель', lat: 50.4555, lng: 30.5250 }
      ]

      this.markers = markerData.map(({ name, lat, lng }) => {
        const icon = L.divIcon({
          className: 'material-marker',
          html: `<span class="material-icons">location_on</span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })

        const marker = L.marker([lat, lng], { icon }).bindPopup(name)

        marker.on('add', () => {
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

        return marker
      })
    },
    toggleMarkersVisibility() {
      const currentZoom = this.map.getZoom()

      this.markers.forEach(marker => {
        const isOnMap = this.map.hasLayer(marker)

        if (currentZoom >= this.minZoomToShowMarkers) {
          if (!isOnMap) {
            marker.addTo(this.map)
          }
        } else {
          if (isOnMap) {
            this.map.removeLayer(marker)
          }
        }
      })
    }
  },
  watch: {
    selectedCity(newCity) {
      const coords = cityCoords[newCity]
      if (coords && this.map) {
        this.map.setView(coords, 12)
        this.toggleMarkersVisibility()
      }
    }
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
