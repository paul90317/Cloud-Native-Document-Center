import { createRouter, createWebHistory } from 'vue-router'
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

export default router
