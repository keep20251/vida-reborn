export default function ({ data, status, config, headers, request, statusText }) {
  // mock
  if (config.url.includes('mock')) {
    return Promise.resolve({ data, status, config, headers, request, statusText })
  }

  // 非 API 的回應
  const { url } = config
  if (['/api', 'api'].every((prefix) => !url.startsWith(prefix))) {
    return Promise.resolve(data)
  }

  // 以下為呼叫 API 的回應
  if (status === 200) {
    // 這邊是加密的資料，讓後續繼續處理
    return { data, status, config, headers, request, statusText }
  }

  return Promise.reject(data)
}
