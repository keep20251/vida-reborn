export default function (request) {
  // 如果是 mock api 則修改Header Content-Type
  if (request.url.includes('mock')) {
    request.headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  return request
}
