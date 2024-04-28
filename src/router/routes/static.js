export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    isHidden: true,
    component: () => import('@/views/404.vue'),
  }
]