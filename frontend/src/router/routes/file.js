export default [
  {
    path: '/file/review/1',
    name: 'file.review',
    title: 'Review',
    component: () => import('@/views/file/Review.vue')
  },
  {
    path: '/file/edit/permission/1',
    name: 'file.edit.permission',
    title: 'Edit Permission',
    component: () => import('@/views/file/edit/Permission.vue')
  },
  {
    path: '/file/edit/reviewer/1',
    name: 'file.edit.reviewer',
    title: 'Edit Reviewer',
    component: () => import('@/views/file/edit/Reviewer.vue')
  },
]
