import fs from 'fs'
import path from 'path'
import ascii from 'ascii-art'
import express from 'express'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'

async function createServer(root = process.cwd(), hmrPort = 6173) {
  const isProd = process.env.NODE_ENV === 'production'
  const isStag = process.env.NODE_ENV === 'staging'
  const isDev = !isProd && !isStag
  console.log(`[createServer]Environment: ${process.env.NODE_ENV}`)
  console.log(`server env`, { isProd, isStag, isDev })
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : isStag
      ? fs.readFileSync(resolve('dist-staging/client/index.html'), 'utf-8')
      : ''

  const manifest = isProd
    ? JSON.parse(fs.readFileSync(resolve('dist-staging/client/ssr-manifest.json'), 'utf-8'))
    : isStag
      ? JSON.parse(fs.readFileSync(resolve('dist-staging/client/ssr-manifest.json'), 'utf-8'))
      : {}

  const app = express()

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
    app.use('/', (await import('serve-static')).default(resolve('dist/client'), { index: false }))
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl.replace('/test/', '/')

      let template, render
      if (isDev) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = indexProd
        render = isProd
          ? (await import('./dist/server/entry-server.js')).render
          : (await import('./dist-staging/server/entry-server.js')).render
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

function main() {
  let port = 6174
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

ascii.font('Vida SSR', 'Doom').then((rendered) => {
  console.log(rendered)
  main()
})
