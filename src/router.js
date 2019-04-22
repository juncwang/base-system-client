import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      redirect: '/home',
      children: [
        { path: '/home', name: 'home', component: () => import('./views/Home')},
        { path: '/auths', name: 'auths', component: () => import('./views/AuthList')},
        { path: '/users', name: 'users', component: () => import('./views/UserList')}
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.path == '/login'){
    next()
  }else{
    let token = localStorage.getItem('baseSystem-Token')
    if(token){
      next()
    }else{
      next('/login')
    }
  }
})

export default router
