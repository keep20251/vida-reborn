import axios from 'axios'
import fs from 'fs'

async function main() {
  const id = process.env.I18N_ID
  const response = await axios.get(
    `https://script.google.com/macros/s/AKfycbys-rzD0JipYzihVgzBPq60NcaazmWv0pQTRSo7sr6FXAtx3FWbH-EHHX6j0IBDlJqJLQ/exec?id=${id}`,
  )
  const result = {}
  const json = response.data
  const langKeys = Object.keys(json).filter((key) => key !== 'undefined')

  langKeys.forEach((lang) => (result[lang] = {}))
  langKeys.forEach((lang) => {
    const keys = Object.keys(json[lang])
    keys.forEach((key) => {
      const keyArr = key.split('.')
      const value = json[lang][key].toString()
      let curr = result[lang]

      keyArr.forEach((key, index) => {
        if (key.includes('-')) key = `'${key}'`
        if (index === keyArr.length - 1) {
          curr[key] = value
        } else {
          curr[key] = curr[key] || {}
        }
        curr = curr[key]
      })
    })
  })

  langKeys.forEach((language) => {
    fs.writeFileSync(
      `./src/i18n/locale/${language}.ts`,
      `/* eslint-disable prettier/prettier */
      export default${JSON.stringify(result[language])};`.replace(/"([^(")"]+)":/g, '$1:'),
      'utf8',
    )
  })

  console.log('done')
}

main()
