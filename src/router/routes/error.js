import Error401 from '@/pages/errors/401.vue'
import Error404 from '@/pages/errors/404.vue'

export default [
  { name: 'error-401', path: '/error-401', component: Error401, meta: {} },
  { name: 'error-404', path: '/:catchAll(.*)', component: Error404, meta: {} },
]
