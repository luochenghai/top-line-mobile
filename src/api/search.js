/**
 * 搜索相关接口
*/
import request from '@/utils/request'
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

/***
 * 获取搜索结果
 *
 * *****/
export const getSearch = ({
  page,
  perPage,
  q // 搜索关键字
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}
