
/**
 *************************** 首页视图组件
 **/
import Vue from 'vue'
import VueRouter from 'vue-router'
// 1. 引入登录页面
import Login from '@/views/login'
// tabbar
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/article'
import My from '@/views/my'
import User from '@/views/user'
import Chat from '@/views/chat'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'search',
      path: '/search',
      component: Search
    },
    {
      name: 'search-result',
      path: '/search/:q',
      component: SearchResult
    },
    {
      name: 'article',
      path: '/article/:articleId',
      component: Article
    },
    {
      name: 'user',
      path: '/user',
      component: User
    },
    {
      name: 'chat',
      path: '/chat',
      component: Chat
    },

    {
      path: '/',
      component: Tabbar,
      children: [
        {
          name: 'home',
          path: '', // 默认子路由
          component: Home
        },
        {
          name: 'my',
          path: '/my', // 默认子路由
          component: My
        }
      ]
    }
  ]
})

//  导出之后再main.js 中挂载
export default router
