import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "../stores/user.js"
import { getLocalToken } from "../utils/storage.js"
import authRouter from './routes/auth'
import fileRouter from './routes/file'
import notificationRouter from './routes/notification'
import staticRouter from './routes/static'

const history = createWebHistory()

function loadRoutes() {
  const routes = [
    ...authRouter,
    ...fileRouter,
    ...notificationRouter,
    ...staticRouter
  ]
  return routes
}

const router = createRouter({
  history,
  routes: loadRoutes(),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

const whiteList = ['/login', '/register', '/SignUp']

router.beforeEach(async (to, from, next) => {
  // Change the title of the page
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Check if the user is logged in
  const token = getLocalToken()
  const store = useUserStore()

  // Overwrite the token in the store
  if (token) {
    await store.setToken(token)
  }

  // Debug: can be removed
  console.log('token exist: ', token !== null)
  console.log('store.getAccessToken exist: ', store.getAccessToken !== null)

  // isLogin condition: can be improved
  const isLogin = token && store.getAccessToken

  if (whiteList.includes(to.path)) {
    // if the user is logged in and navigate to auth-related page (whitelist)
    // => redirect to the home page
    if (isLogin) {
      next({ name: 'Home' })
    }
  } else {
    // if the user is not logged in and navigate to non-auth-related page
    // => redirect to the login page
    if (!isLogin) {
      next({ name: 'Login' })
    }
  }

  // Default: continue to the target route
  next()
})

export default router
