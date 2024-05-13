export default [
  {
    title: 'File',
    children: [
      {
        path: '/file',
        name: 'file.index',
        title: 'List',
        component: () => import('@/views/file/index.vue')
      },
      {
        path: '/file/review/:id',
        name: 'file.review',
        title: 'Review',
        component: () => import('@/views/file/Review.vue')
      },
      {
        path: '/file/edit/permission/:id',
        name: 'file.edit.permission',
        title: 'Edit Permission',
        component: () => import('@/views/file/edit/Permission.vue')
      },
      {
        path: '/file/edit/reviewer/:id',
        name: 'file.edit.reviewer',
        title: 'Edit Reviewer',
        component: () => import('@/views/file/edit/Reviewer.vue')
      },
    ]
  },
]
