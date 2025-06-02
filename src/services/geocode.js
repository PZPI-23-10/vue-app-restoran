import axios from 'axios'

export async function geocodeAddress(region, city, street) {
  const query = city === 'Київ'
  ? `${street}, ${city}, Україна`
  : `${street}, ${city}, ${region}, Україна`


  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`

  try {
    const response = await axios.get(url)
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0]
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}
