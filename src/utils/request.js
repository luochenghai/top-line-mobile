/**
 * 封装 axios 请求函数
 **/
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建sxios 实例
// axios.create 的作用的是克隆一个 axios 实例 ，它的作用和axios 一样
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
export default request // 导出
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
