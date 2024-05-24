export default [
  {
    path: '/login',
    name: 'Login',
    title: 'Login',
    isHidden: true,
    component: () => import('@/views/user/Login.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    title: 'SignUp',
    isHidden: true,
    component: () => import('@/views/user/SignUp.vue')
  }
]
