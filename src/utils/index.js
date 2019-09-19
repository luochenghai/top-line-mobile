import store from '@/store'
import { request } from 'http'
// add a request interceptor(拦截器)
request.interceptor.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer $(user.token)`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
