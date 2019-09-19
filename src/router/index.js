import Vue from 'vue'
import VueRouter from 'vue-router'
// 1. 引入登录页面
import Login from '@/views/login'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  //   {
  //     // path: '/about',
  //     // name: 'about',
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  //   }
  ]
})

//  导出之后再main.js 中挂载
export default router
