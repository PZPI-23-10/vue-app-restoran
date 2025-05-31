// services/cityService.js

export function getCityCoordinates(cityName, restaurants) {
  for (const restaurant of restaurants) {
    if (restaurant.city === cityName) {
      const lat = parseFloat(restaurant.latitude)
      const lng = parseFloat(restaurant.longitude)

      // Проверяем валидность координат
      if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
        return [lat, lng]
      }
    }
  }
  return null
}
