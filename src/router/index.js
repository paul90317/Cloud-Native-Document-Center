import { createRouter, createWebHistory } from 'vue-router'

const history = createWebHistory()

function loadRoutes() {
  const routeFiles = import.meta.glob('@/router/routes/*.js', { eager: true })
  var routes = []

  for (const path in routeFiles) {
    const routeModule = routeFiles[path].default
    // add "{isHidden: true}" to hide routes in the Navbar
    routes = [...routes, ...routeModule.filter(route => !('isHidden' in route))]
  }

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
