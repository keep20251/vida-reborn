export const MEDIA_TYPE = {
  ALL: 0,
  IMAGE: 1,
  VIDEO: 2,
}

export const FEED_PERM = {
  SCH: 0,
  SUB: 2,
  BUY: 3,
  PRI: 10,
}

export const UPLOAD_STATUS = {
  PENDING: 1,
  PREPROCESSING: 2,
  UPLOADING: 3,
  DONE: 4,
  FAIL: 5,
  SAVE: 6,
}

export const FEED_STATUS = {
  REVIEW: 1, // 未審核
  PUBLISHED: 2, // 發布成功
  PASS: 3, // 已通過審核待發布
  READY_SLICE: 4, // 等待切片
  REJECT: 5, // 審核失敗
  SLICING: 15, // 切片中
  CODEC: 20, // 轉碼中
  CODEC_FAILURE: 25, // 轉碼失敗
}
export const FEED_STATUS_FORMATING = [FEED_STATUS.READY_SLICE, FEED_STATUS.SLICING, FEED_STATUS.CODEC]

export const IMAGE_LIMIT_COUNT = 10
