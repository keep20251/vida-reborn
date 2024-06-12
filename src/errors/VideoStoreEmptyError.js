export default class VideoStoreEmptyError extends Error {
  constructor(message) {
    super(message)
    this.name = 'VideoStoreEmptyError'
  }
}
