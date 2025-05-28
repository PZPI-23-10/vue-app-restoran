import axios from 'axios'

const API_BASE_URL = 'https://backend-restoran.onrender.com/api'

export function fetchRestaurants() {
  return axios.get(`${API_BASE_URL}/Restaurant`)
}
