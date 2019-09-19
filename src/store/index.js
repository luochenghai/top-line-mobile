/********
 * 使用 Vuex 容器存储 token
 * Vuex 容器中的数据只是为了方便在其他任何地方能方便的获取登录状态数据，
 * 但是页面刷新还是会丢失数据状态，所以我们还要把数据进行持久化中以防止
 * 页面刷新丢失状态的问题。前端持久化常见的方式就是：
- 本地存储
- Cookie
 * ***********/
import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, saveUser } from '@/utils/user'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getUser()
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 将数据放到本地存储的目的是为了保持刷新保存数据状态
      saveUser(state.user)
    }
  },
  actions: {

  }
})
