import csv from 'csv-parser'
import fs from 'fs'
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
  const subFolders = []

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
      const keys = data.key.split('.')
      const folder = keys[0]
      if (!subFolders.includes(folder)) subFolders.push(keys[0])
      valueKeys.forEach((valueKey) => reduce(keys, data[`${valueKey}`], result[`${valueKey}`]))
    })
    .on('end', () => {
      valueKeys.forEach((valueKey) => {
        subFolders.forEach((subFolder) => {
          writeFile(valueKey, result[`${valueKey}`][`${subFolder}`], subFolder)
        })
      })
      console.log('解析完成')
    })
}

const writeFile = (filename, data, subFolder) => {
  const outputPath = `./public/about/${subFolder}/${filename}.json`
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
