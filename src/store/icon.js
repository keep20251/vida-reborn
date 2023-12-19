import { iconMap } from '@/constant/icon-map'
import { defineStore } from 'pinia'

export const useIconStore = defineStore('icon-store', () => {
  const modules = Object.freeze(import.meta.glob('../assets/icons/*/*.svg'))

  function getModuleLoader(name) {
    return modules[`../assets/icons/${iconMap[name]}.svg`]
  }

  return {
    getModuleLoader,
  }
})
