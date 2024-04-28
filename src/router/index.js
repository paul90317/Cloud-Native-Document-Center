import { createRouter, createWebHistory } from 'vue-router'

const history = createWebHistory()

function loadRoutes() {
  const routeFiles = import.meta.glob('@/router/routes/*.js', { eager: true })
  var routes = []

  for (const path in routeFiles) {
    const routeModule = routeFiles[path].default
    routes = [...routes, ...routeModule]
  }
  console.log(routes)
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
