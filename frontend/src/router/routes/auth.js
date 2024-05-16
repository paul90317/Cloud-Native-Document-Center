export default [
  {
    path: '/register',
    name: 'Register',
    title: 'Register',
    isHidden: true,
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    title: 'Login',
    isHidden: true,
    component: () => import('@/views/LoginView.vue')
  }
]