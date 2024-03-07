import { basename } from 'node:path'
import { renderToString } from 'vue/server-renderer'
import { containsLang, createI18n } from '@/i18n'
import { createApp } from './main'

export async function render(url, manifest, ctx) {
  const { app, router, store, head } = await createApp()

  let locale
  if (ctx.req.cookies.__LOCALE) {
    locale = ctx.req.cookies.__LOCALE
  } else {
    const urlLang = url.split('/')[1]
    const acceptLang = ctx.req.get('accept-language')?.split(',')[0].split(';')[0].toLocaleLowerCase()

    if (containsLang(urlLang)) {
      locale = urlLang
    } else if (containsLang(acceptLang)) {
      locale = acceptLang
    } else {
      locale = 'en'
    }

    ctx.res.cookie('__LOCALE', locale, { path: '/' })
  }

  const i18n = await createI18n(locale)
  app.use(i18n)

  // query.lang 可能會在 vue router redirect 被使用到
  await router.push(`${url}${url.indexOf('?') === -1 ? '?' : '&'}lang=${locale}`)
  await router.isReady()

  const html = await renderToString(app, ctx)

  const preloadLinks = renderPreloadLinks(ctx.modules, manifest)

  const stateHtml = store.state.value.hydration
    ? `<script id="ssr-state">window.__INITIAL_STATE__ = ${JSON.stringify(
        JSON.stringify(store.state.value.hydration),
      )}</script>`
    : ''

  return [html, preloadLinks, stateHtml, head]
}

function renderPreloadLinks(modules, manifest) {
  let links = ''
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          const filename = basename(file)
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`
  } else {
    // TODO
    return ''
  }
}
