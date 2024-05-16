import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  // baseURL: "http://localhost:3000/api",
  timeout: 150000
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

export default service
