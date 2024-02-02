import SearchHistory from '@/pages/search/SearchHistory.vue'
import SearchResult from '@/pages/search/SearchResult.vue'

const prefix = 'search'

export default [
  { name: `${prefix}-history`, path: '', component: SearchHistory, meta: {} },
  { name: `${prefix}-result`, path: 'result', component: SearchResult, meta: {} },
]
