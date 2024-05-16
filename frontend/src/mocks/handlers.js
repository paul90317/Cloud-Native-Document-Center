function loadRoutes() {
  let apiFiles = import.meta.glob('@/mocks/apis/*.js', { eager: true })
  var apis = []

  for (const path in apiFiles) {
    const routeModule = apiFiles[path].default
    apis = [...apis, ...routeModule]
  }
  return apis
}

const handlers = loadRoutes()

export default handlers