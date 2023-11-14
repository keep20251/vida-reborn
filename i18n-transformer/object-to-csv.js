import fs from 'fs'
import path from 'path'
import readline from 'readline'

let folderPath = ''
const fileName = 'i18n'

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const objectToCsv = (obj, parentKey = '') => {
  let result = ''

  for (const key in obj) {
    const value = obj[key]
    const currentKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof value === 'object') {
      result += objectToCsv(value, currentKey)
    } else {
      result += `${currentKey},"${value}"\n`
    }
  }
  return result
}

const splitTextByComma = (text) => {
  const regex = /('[^']*'|"[^"]*"|[^,]+)(?:,|$)/g
  const parts = []
  let match

  while ((match = regex.exec(text)) !== null) {
    const part = match[1].trim()
    const cleanedPart = part.startsWith('"') && part.endsWith('"') ? part.slice(1, -1) : part
    parts.push(cleanedPart)
  }
  return parts
}

const main = async () => {
  if (!folderPath) {
    console.error('Please provide a path to the file')
    process.exit(1)
  }

  if (!fileName) {
    console.error('Please provide a name for the output file')
    process.exit(1)
  }

  try {
    const dynamicImports = {}
    const fileNames = []
    const csvData = {}
    let result = ''

    fs.readdirSync(folderPath).forEach(async (file) => {
      if (file.endsWith('.js')) {
        const fileName = path.parse(file).name
        const filePath = path.join(folderPath, file)
        fileNames.push(fileName)

        const importation = await import(`./${filePath}`)
        dynamicImports[fileName] = importation.default
        csvData[fileName] = objectToCsv(dynamicImports[fileName]).split('\n')
      }
    })

    setTimeout(() => {
      let header = 'key'
      for (let index = 0; index < fileNames.length; index++) {
        header += `,${fileNames[index]}`
        if (index === fileNames.length - 1) header += '\n'
      }
      result += header

      const fileLength = csvData[fileNames[0]].length
      for (let i = 0; i < fileLength - 1; i++) {
        let line = splitTextByComma(csvData[fileNames[0]][i])[0]
        for (const key of Object.keys(csvData)) {
          const value = splitTextByComma(csvData[key][i])[1]
          line += `,${value}`
        }
        line += '\n'
        result += line
      }
      const outputPath = `./output/csv/${fileName}.csv`
      fs.writeFile(outputPath, result, (e) => {
        if (e) console.error('[Export file error]', e)
        else console.log(`[File exported] ${path.resolve(outputPath)}`)
      })
    }, 500)
  } catch (e) {
    console.error('[Error reading file]', e)
    process.exit(1)
  }
}

readLine.question('請輸入要解析的i18n資料夾路徑(相對或絕對路徑, 裡面必須有語系.js): ', (path) => {
  folderPath = path
  readLine.close()
  main()
})
