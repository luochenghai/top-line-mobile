import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js' // 使用 amfe-flexible 动态设置 html 标签的字体大小 npm i amfe-flexible

// 按需注册 Vant 组件
import { Button } from 'vant'
Vue.use(Button)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
