import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js' // 使用 amfe-flexible 动态设置 html 标签的字体大小 npm i amfe-flexible
import './styles/index.less' // REM 转换
import {
  ValidationProvider,
  extend,
  ValidationObserver
} from 'vee-validate'
import * as rules from 'vee-validate/dist/rules' // 加载所有的验证规则
import zhCN from 'vee-validate/dist/locale/zh_CN' //
import { relativeTime } from './utils/date' // 引入封装好的相对时间处理插件
import fastClick from 'fastclick'

// 3. 注册成为全局组件
import {
  Button,
  Cell,
  CellGroup,
  NavBar,
  Field,
  Toast,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  PullRefresh,
  Grid,
  GridItem,
  Image,
  Lazyload,
  Loading,
  Popup,
  Icon,
  Search,
  Dialog,
  ActionSheet,
  DatetimePicker

} from 'vant'
// 解决移动端浏览器300ms延迟问题
fastClick.attach(document.body)
Vue.filter('relativeTime', relativeTime) // 全局注册时间过滤器
Vue
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Field)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)
  .use(Grid)
  .use(GridItem)
  .use(Image)
  .use(Lazyload)
  .use(Loading)
  .use(Popup)
  .use(Icon)
  .use(Search)
  .use(Dialog)
  .use(ActionSheet)
  .use(DatetimePicker)
// 2. 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message  // messages 少写了一个s
  })
}

extend('phone', {
  validate (value) {
    return /^1\d{10}$/.test(value)
  },
  message: '必须是手机号'
})
// 第三方表单校验插件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
