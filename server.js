import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production', hmrPort = 6173) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''
  const manifest = isProd ? JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8')) : {}

  const app = express()

  let vite

  if (!isProd) {
    vite = await createViteServer({
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
    app.use('/test/', (await import('serve-static')).default(resolve('dist/client'), { index: false }))
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render

      if (!isProd) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = indexProd
        render = (await import('./dist/server/entry-server.js')).render
      }

      const [appHtml, preloadLinks, store] = await render(url, manifest)
      const html = template
        .replace('<!--preload-links-->', preloadLinks)
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`<!--pinia-state-->`, store)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

createServer().then(({ app }) => {
  const port = 6174
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}...`)
  })
})
