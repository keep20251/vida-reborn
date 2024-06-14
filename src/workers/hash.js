self.onmessage = (evt) => {
  const { slices } = evt.data
  let totalHash = new ArrayBuffer()

  const loadNext = (index) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(slices[index])
    reader.onload = async (evt) => {
      const sliceHash = await crypto.subtle.digest('SHA-256', evt.target.result)
      totalHash = concatArrayBuffers(totalHash, sliceHash)
      console.log(`hash-${index} complete`)

      const nextIndex = index + 1
      if (nextIndex === slices.length) {
        const hashArrayBuffer = await crypto.subtle.digest('SHA-256', totalHash)
        const hashBase64 = arrayBufferToBase64(hashArrayBuffer)
        console.timeEnd('hashing')
        self.postMessage({ progress: 1, filehash: hashBase64 })
        self.close()
      } else {
        self.postMessage({ progress: nextIndex / slices.length })
        loadNext(nextIndex)
      }
    }
  }

  console.time('hashing')
  loadNext(0)
}

function arrayBufferToBase64(buf) {
  let binary = ''
  const bytes = new Uint8Array(buf)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function concatArrayBuffers(a, b) {
  const c = new Uint8Array(a.byteLength + b.byteLength)
  c.set(new Uint8Array(a), 0)
  c.set(new Uint8Array(b), a.byteLength)
  return c
}
