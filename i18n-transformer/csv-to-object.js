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
      valueKeys.forEach((valueKey) => reduce(keys, data[`${valueKey}`], result[`${valueKey}`]))
    })
    .on('end', () => {
      console.log('解析完成')
      valueKeys.forEach((valueKey) => writeFile(valueKey, result[`${valueKey}`]))
    })
}

const writeFile = (filename, data) => {
  // const outputPath = `./i18n-transformer/output/js/${filename}.js`
  const outputPath = `./src/i18n/locale/${filename}.ts`
  fs.writeFile(outputPath, `export default ${JSON.stringify(data)}`, (e) => {
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
