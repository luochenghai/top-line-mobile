import request from '@/utils/request' // 导入分装好的请求模块

/**
 * 获取所有频道列表
 */
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

/****
 * 获取用户频道列表或默认推荐列表
 * 如果有 token，则返回用户频道列表（数据）
 * 如果没有 token，则返回默认推荐的频道列表
 * **/
export const getUserOrDefaultChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

/******
 * 重置用户频道列表提示：

- 正常应该使用新增频道的数据接口，但是该接口暂时有问题，实际工作中要和后端沟通解决
- 对于无法通过文档一眼看懂的接口使用文档，建议先使用 postman 把接口搞明白，然后再进行编码

 *
 * ******/
export const resetUserChannels = channels => {
  return request({
    method: 'PUT',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}

/***
 * 删除指定用户频道
 *
 * ***/
export const deleteUserChannels = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
