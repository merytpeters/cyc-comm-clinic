import axios from 'axios'

const API = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

API.interceptors.request.use(
  (config) => {
    config.withCredentials = true
    return config
  },
  (error) => Promise.reject(error)
)

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API
