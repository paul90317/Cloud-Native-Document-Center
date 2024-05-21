import { createRouter, createWebHistory } from 'vue-router'
import authRouter from './routes/auth'
import fileRouter from './routes/file'
import notificationRouter from './routes/notification'
import staticRouter from './routes/static'
import {getLocalToken} from "../utils/storage.js";
import {useUserStore} from "../stores/user.js";

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

const whiteList = ['/login', '/register', '/signup']

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const token = getLocalToken()
  const store = useUserStore()

  if (!whiteList.includes(to.path)) {
    if (!token || !store.getAccessToken ) {
      next({ name: 'Login' })
    }
  }

  if (token) store.setToken(token)

  next()
})

export default router
