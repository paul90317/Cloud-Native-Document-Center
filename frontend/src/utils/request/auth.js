import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "/api/auth",
  timeout: 50000
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // check / getToken from useUserStore(pinia store)
    // if (hasToken) {
    //   config.headers['Authorization'] = 'Bearer ' + getAccessToken()
    // }
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

export default service
