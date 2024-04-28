export default [
  {
    path: '/',
    name: 'Home',
    isHidden: true,
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    isHidden: true,
    component: () => import('@/views/404.vue')
  },
  {
    path: '/test',
    name: 'TestEditor',
    component: () => import('@/views/TestEditor.vue')
  }
]
