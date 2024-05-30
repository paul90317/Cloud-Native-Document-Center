import { useUserStore } from '@/stores/user'
import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "/api/file",
  timeout: 50000
})


// request interceptor
service.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    if (store.hasToken) {
      config.headers['Authorization'] = `Bearer ${store.getAccessToken}`
    }
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

export default service
