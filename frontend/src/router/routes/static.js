export default [
  {
    path: '/',
    name: 'Home',
    title: 'Home',
    isHidden: true,
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    title: '404',
    isHidden: true,
    component: () => import('@/views/404.vue')
  },
  {
    path: '/test',
    name: 'TestEditor',
    title: 'Test Editor',
    component: () => import('@/views/TestEditor.vue')
  }
]
