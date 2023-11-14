import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import readline from 'readline'

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let filePath = ''

const main = () => {
  const result = {}
  const valueKeys = []

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('headers', (headers) => {
      for (const header of headers) {
        if (header === 'key') continue
        valueKeys.push(header)
        result[`${header}`] = {}
      }
    })
    .on('data', (data) => {
      const key = data.key
      valueKeys.forEach((valueKey) => {
        if (!Array.isArray(result[`${valueKey}`])) result[`${valueKey}`] = []
        result[`${valueKey}`].push({ code: key, name: data[`${valueKey}`] })
      })
    })
    .on('end', () => {
      console.log('result', result)
      valueKeys.forEach((valueKey) => {
        writeFile(valueKey, result[`${valueKey}`])
      })
      console.log('解析完成')
    })
}

const writeFile = (filename, data) => {
  const outputPath = `./public/about/select/${filename}.json`
  fs.writeFile(outputPath, JSON.stringify(data), (e) => {
    if (e) console.error('[Export file error]', e)
    else console.log(`[File exported] ${path.resolve(outputPath)}`)
  })
}

const reduce = (keys, value, curr) => {
  keys.reduce((obj, key, index) => {
    if (index === keys.length - 1) {
      obj[key] = value
    } else {
      obj[key] = obj[key] || {}
    }
    return obj[key]
  }, curr)
}

readLine.question('請輸入要解析的CSV檔案絕對或相對路徑: ', (path) => {
  filePath = path.replace(/^'|'$/g, '')
  readLine.close()
  main()
})
