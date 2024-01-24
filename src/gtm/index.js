import { createGtm as createSupportGtm, useGtm as useSupportGtm } from '@gtm-support/vue-gtm'
import { EVENTS } from '@const/gtm'

const gtm_id = import.meta.env.VITE_GTM_ID || undefined
const gtm_defer = import.meta.env.VITE_GTM_DEFER || false
const gtm_compatiblility = import.meta.env.VITE_GTM_COMPATIBLILITY || false
const gtm_enable = import.meta.env.VITE_GTM_ENABLE || true
const gtm_debug = import.meta.env.VITE_GTM_DEBUG || true
const gtm_load_script = import.meta.env.VITE_GTM_LOAD_SCRIPT || true
const gtm_track_on_next_tick = import.meta.env.VITE_GTM_TRACK_ON_NEXT_TICK || false

/**
 * Google Tag Manager for Vue.js
 * @link https://www.npmjs.com/package/@gtm-support/vue-gtm
 * @param {Object} router
 */
export function createGtm(router) {
  return createSupportGtm({
    id: gtm_id,
    defer: gtm_defer,
    compatiblility: gtm_compatiblility,
    enabled: gtm_enable,
    debug: gtm_debug,
    loadScript: gtm_load_script,
    trackOnNextTick: gtm_track_on_next_tick,
    vueRouter: router,
  })
}

export function trackEvent({ key, value = null, meta = {} }) {
  console.log('trackEvent', key, value, meta)
  const gtm = useSupportGtm()
  if (!gtm) {
    if (!import.meta.env.DEV) {
      console.warn('Gtm is not initial, but trackEvent is called, process is terminated.')
    }
    return
  }
  const { name, category, action, label } = EVENTS[key]
  console.log('gtm.trackEvent', { key, name, category, action, label, value, meta })
  gtm.trackEvent({
    event: name,
    category,
    action,
    label,
    value,
    meta,
  })
}

// TODO 這邊還沒寫到，先保留
export function trackView() {
  const gtm = useSupportGtm()
  if (!gtm) {
    if (!import.meta.env.DEV) {
      console.warn('Gtm is not initial, but trackEvent is called, process is terminated.')
    }
    return
  }
  console.log('gtm.trackView')
}
