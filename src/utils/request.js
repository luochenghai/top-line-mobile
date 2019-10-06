/**
 * 封装 axios 请求函数
 **/

import axios from 'axios'
import JSONbig from 'json-bigint'
// 《使用拦截器统一添加 token》2. 加载容器
// 在非组件模块中访问 Vuex 容器，那就谁用谁就直接加载
// 这里加载得到的 store 和组件中的 $store 是一个东西

// 处理token过期问题 20191006
import store from '@/store'
import router from '@/router'
// 处理token过期问题 20191006

// 创建axios 实例
// axios.create 的作用的是克隆一个 axios 实例 ，它的作用和axios 一样
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// add by lch in 20191006
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
// end
// 配置处理后端返回的数据中包含超出 JS安全整数范围问题
request.defaults.transformResponse = [function (data) {
  // 黑马头条PC端写法 return data ? JSONbig.parse(data):{}
  try {
    // data 的数据可能不是标准的ＪＳＯＮ格式的字符串，否则会导致ＪＳＯＮｂｉｇ．ｐａｒｓｅ（ｄａｔａ）
    // 转换失败
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接照样返回
    return data
  }
}]

// add by lch 20191006
// 配置 axios 的请求拦截器和响应拦截器
/**
 * 请求拦截器
 * 使用拦截器统一添加 token
*/
// 注意：为 request 添加拦截器
// 《使用拦截器统一添加 token》1. 添加拦截器
// add a request interceptor(拦截器)

// 非组件模块访问容器直接加载即可
// 这里得到的 store 和组件中访问的 this.$store 是一个东西
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 统一在请求头中添加 token，名字，数据
  // 《使用拦截器统一添加 token》3. 添加 token
  const { user } = store.state // 取别名
  if (user) {
    // 注意：Bearer 后面有一个空格，这是后端要求的数据格式
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

/**
 *
 * 响应拦截器
*/
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, async error => {
  const { user } = store.state
  // console.log(router.currentRoute) // 这个对象和组件中的 $route 是一个东西
  // 如果 401
  if (error.response && error.response.status === 401) {
    // 判断是否有 refresh_token
    // 如果没有 refresh_token，直接跳转登录页
    if (!user || !user.refresh_token) {
      // 跳转到登录页
      router.push({
        name: 'login',
        // 固定的使用动态
        // 例如 /user/1 /user/2 /user/3 /user/xxx ，不允许出现 /user
        // 动态路由：
        // 路由路径：/xxx/:xxx
        // 传参：params: { 名字: 值 }
        // 获取：$route.params.xxx

        // 可选的，就使用 query
        // /login /login?foo=bar
        // 这个参数不用修改路由之前的路径，仅此而已
        // 传递这样穿，获取的时候使用 $route.query.xxx 来获取
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      return
    }
    // 如果有，就请求获取新的 token
    //  把新的 token 更新到容器中
    //  原来过期的请求重新发出去
    try {
      // 这里务必单独创建一个请求对象来请求刷新 token
      // 不要使用 request 请求对象，因为拦截器里面的代码不一样
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 刷新 token 成功，将 token 重新存储
      store.commit('setUser', {
        token: data.data.token, // 重新获取的最新 token
        refresh_token: user.refresh_token // 还是原来的
      })

      // 把之前失败的请求重新发出去
      return request(error.config)
    } catch (err) {
      // 刷新 token 都失败了，甭想了 ，直接跳转到登录页
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }
  }
  return Promise.reject(error)
})
export default request // 导出请求对象
