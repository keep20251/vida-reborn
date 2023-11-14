export default class ChatToSelfError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ChatToSelfError'
  }
}
