import request from '@/utils/request'
/***
 * 获取文章列表数据
 **/

export const getArticles = ({

  // JavaScript Standard Style 代码风格不允许有非驼峰名命名法的变量
  // 但是对象的属性名是不检查的
  channelId,
  timestamp,
  withTop }) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}

/****
 * 获取文章详情
 *
 * ****/
export const getArticle = (articleId) => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

/****
 * 点赞文章
 *
 * ****/
export const likeArticle = (articleId) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/****
 * 取消点赞文章
 *
 * ****/
export const unLikeArticle = (articleId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}

/****
 * 对文章不喜欢
 *
 * ****/
export const addDislike = (articleId) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

/****
 * 取消对文章的不喜欢换
 *
 * ****/
export const deleteDislike = (articleId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/dislikes/${articleId}`
  })
}
