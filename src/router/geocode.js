import axios from 'axios'

export async function geocodeAddress(region, city, street) {
  const query = `${region}, ${city}, ${street}`
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept-Language': 'uk-UA',
        'User-Agent': 'YourAppName/1.0 (avecezarus45@email.com)' // 💡 важно!
      }
    })

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0]
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) }
    } else {
      return null
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}
