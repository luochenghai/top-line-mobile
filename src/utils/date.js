/*****
 * 相对时间模块
 * **/
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 按需加载
import rTime from 'dayjs/plugin/relativeTime' // 相对时间插件
dayjs.locale('zh-cn') // 全局使用中文语言
dayjs.extend(rTime) // 配置使用相对时间插件

// 相对时间处理函数
export const relativeTime = time => {
// 相对时间参考文档：https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/Plugin.md#relativetime
  return dayjs().from(dayjs(time))
}

// 添加一个专门处理格式化日期的函数：
export const formatDate = date => {
  return dayjs(date).format('YYYY-MM-DD')
}

// console.log(dayjs().format('YYYY/MM-DD'))
// console.log(dayjs().from(dayjs('2019-9-21 14:54:09')))
// console.log(dayjs().from(dayjs(), true))

// const dayjs = require('dayjs')
// const relativeTime = require('dayjs/plugin/relativeTime')
// require('dayjs/locale/zh-cn')

// // 配置使用中文
// dayjs.locale('zh-cn')

// // 注册使用相对时间插件
// dayjs.extend(relativeTime)

// console.log(dayjs().format('YYYY/MM-DD'))
// console.log(dayjs().from(dayjs('2019-9-21 14:54:09')))
// console.log(dayjs().from(dayjs(), true))
