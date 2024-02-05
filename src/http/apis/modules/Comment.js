export default {
  // 對帖子進行評論
  add: { method: 'post', url: '/api/comment/add' },

  // 取得帖子的評論列表
  list: { method: 'post', url: '/api/comment/list' },

  // 喜歡評論
  like: { method: 'post', url: '/api/comment/like' },

  // 不喜歡評論
  unlike: { method: 'post', url: '/api/comment/unlike' },
}
