import axios from 'axios'
import {useUserStore} from "../../stores/user.js";

export const baseURL = import.meta.env.DEV ? "/api" : "/api/auth"


const service = axios.create({
  baseURL,
  timeout: 50000
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // check / getToken from useUserStore(pinia store)
    const store = useUserStore()
    if (store.hasToken) {
      config.headers['Authorization'] = 'Bearer ' + store.getAccessToken()
    }
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

export default service
