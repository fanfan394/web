import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import User from '@/components/User.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: User
        }
      ]
    }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})
export default router
