import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "/api/review",
  timeout: 50000
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
