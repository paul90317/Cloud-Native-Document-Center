export default [
  {
    path: '/register',
    name: 'Register',
    title: 'Register',
    isHidden: true,
    component: () => import('@/views/user/Register.vue')
  },
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
