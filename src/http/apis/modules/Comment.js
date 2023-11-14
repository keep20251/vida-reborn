/**
 * 評論 API
 */
export default {
  // 评论列表
  list: { method: 'post', url: '/api/comment/list' },

  // 评论增加
  add: { method: 'post', url: '/api/comment/add' },

  // 评论点赞
  like: { method: 'post', url: '/api/comment/like' },

  // 评论点赞取消
  unlike: { method: 'post', url: '/api/comment/unlike' },
}
