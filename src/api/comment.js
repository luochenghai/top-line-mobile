import request from '@/utils/request'

/**
 * 获取评论
*/

export const getComments = ({
  type,
  source,
  offset,
  limit
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params: {
      type,
      source,
      offset,
      limit
    }
  })
}

/**
 * 添加文章评论/评论回复
*/
export const addComment = ({
  target,
  content,
  artId
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data: {

      target, // 评论的目标ID（评论文章即为文章ID，对评论回复即评论ID）
      content, // 评论内容
      art_id: artId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id 对文章进行评论，不需传递此参数
    }
  })
}
