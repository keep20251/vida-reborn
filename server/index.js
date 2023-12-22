import fs from 'fs'
import path from 'path'
import express from 'express'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'
import { renderSSRHead } from '@unhead/ssr'
import cookieParser from 'cookie-parser'

async function createServer(root = process.cwd(), hmrPort = 6173) {
  const isProd = process.env.NODE_ENV === 'production'
  const isStag = process.env.NODE_ENV === 'staging'
  const isDev = !isProd && !isStag

  console.log(`[createServer]Environment: ${process.env.NODE_ENV}`)
  console.log(`server env`, { isProd, isStag, isDev })

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = (p) => path.resolve(__dirname, p)
  const resolvePath = isProd ? 'dist' : 'dist-staging'

  const indexProd = isDev ? '' : fs.readFileSync(resolve(`../${resolvePath}/client/index.html`), 'utf-8')
  const manifest = isDev
    ? {}
    : JSON.parse(fs.readFileSync(resolve(`../${resolvePath}/client/ssr-manifest.json`), 'utf-8'))

  const app = express()
  app.use(cookieParser())

  let vite
  if (isDev) {
    vite = await createViteServer({
      base: '/',
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    })
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use('/', (await import('serve-static')).default(resolve(`../${resolvePath}/client`), { index: false }))
  }

  app.use('*', async (req, res, next) => {
    try {
      const url = req.originalUrl.replace('/test/', '/')
      console.log(`\x1b[96m [vida:request]${url} \x1b[0m`)

      let template, render
      if (isDev) {
        template = fs.readFileSync(resolve('../index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = indexProd
        render = (await import(`../${resolvePath}/server/entry-server.js`)).render
      }

      const ctx = { req, res }
      const [appHtml, preloadLinks, store, head] = await render(url, manifest, ctx)
      const unheadPayload = await renderSSRHead(head)

      let html = template
        .replace('<!--preload-links-->', preloadLinks)
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`<!--pinia-state-->`, store)

      Object.entries(unheadPayload).forEach(([key, value]) => {
        html = html.replace(`<!--${key}-->`, value)
      })

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

function main() {
  let port = 3001
  const args = process.argv.slice(2)
  args.forEach((arg) => {
    if (arg.startsWith('--port=')) port = arg.split('=')[1]
  })

  createServer().then(({ app }) => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  })
}

main()
