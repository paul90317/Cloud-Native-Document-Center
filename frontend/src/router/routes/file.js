export default [
  {
    path: '/file/review/1',
    name: 'file.review',
    component: () => import('@/views/file/Review.vue')
  },
  {
    path: '/file/edit/permission/1',
    name: 'file.edit.permission',
    component: () => import('@/views/file/edit/Permission.vue')
  },
  {
    path: '/file/edit/reviewer/1',
    name: 'file.edit.reviewer',
    component: () => import('@/views/file/edit/Reviewer.vue')
  },
]
