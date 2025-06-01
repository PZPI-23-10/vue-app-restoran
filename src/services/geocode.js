import axios from 'axios'

export async function geocodeAddress(region, city, street) {
  const query = `${street}, ${city}, ${region}, Україна`
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'VueAppRestoran/1.0 (your-email@example.com)'
      }
    })

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
