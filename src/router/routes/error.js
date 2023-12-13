export default [
  { name: '401', path: '/:catchAll(.*)', component: () => import('@/pages/errors/404.vue'), meta: {} },
  { name: '404', path: '/:catchAll(.*)', component: () => import('@/pages/errors/404.vue'), meta: {} },
]
