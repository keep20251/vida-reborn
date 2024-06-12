export default class VideoLengthOverlimitError extends Error {
  constructor(message) {
    super(message)
    this.name = 'VideoLengthOverlimitError'
  }
}
