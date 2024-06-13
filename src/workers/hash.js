import SparkMD5 from 'spark-md5'

self.onmessage = (evt) => {
  const { slices } = evt.data
  const spark = new SparkMD5.ArrayBuffer()

  const loadNext = (index) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(slices[index])
    reader.onload = (evt) => {
      spark.append(evt.target.result)
      console.log(`hash-${index} complete`)

      const nextIndex = index + 1
      if (nextIndex === slices.length) {
        self.postMessage({ progress: 1, filehash: spark.end() })
        self.close()
      } else {
        self.postMessage({ progress: nextIndex / slices.length })
        loadNext(nextIndex)
      }
    }
  }

  loadNext(0)
}
