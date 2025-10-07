import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CheckData } from '../types/check'

export const useAppStore = defineStore('useAppStore', () => {
  const check = ref<CheckData | null>(null)
  const batchTemplate = ref<CheckData | null>(null)

  return { check, batchTemplate }
})
