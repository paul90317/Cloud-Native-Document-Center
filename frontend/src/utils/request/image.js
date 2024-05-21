import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "/api/image",
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
