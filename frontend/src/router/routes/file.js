export default [
  {
    path: '/file',
    name: 'file.index',
    title: 'FileList',
    component: () => import('@/views/file/index.vue')
  },
  {
    path: '/file/review/:id',
    name: 'file.review',
    title: 'Review',
    isHidden: true,
    component: () => import('@/views/file/Review.vue')
  },
  {
    path: '/file/edit/permission/:id',
    name: 'file.edit',
    title: 'Edit file',
    isHidden: true,
    component: () => import('@/views/TestEditor.vue')
  },
  {
    path: '/file/edit/permission/:id',
    name: 'file.edit.permission',
    title: 'Edit Permission',
    isHidden: true,
    component: () => import('@/views/file/edit/Permission.vue')
  },
  {
    path: '/file/edit/reviewer/:id',
    name: 'file.edit.reviewer',
    title: 'Edit Reviewer',
    isHidden: true,
    component: () => import('@/views/file/edit/Reviewer.vue')
  },
]