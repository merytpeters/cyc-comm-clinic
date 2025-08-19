import axios from 'axios'

const API = axios.create({
  baseURL: '/',
  withCredentials: true,
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      localStorage.removeItem('user')
      location.assign('/login')
    }
    return Promise.reject(error)
  }
)

export default API
