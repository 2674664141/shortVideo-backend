// 全局状态管理
import { defineStore } from 'pinia'
import type { AppState } from '../type'

export const appStore = defineStore('app', {
  state: (): AppState => ({}),
  actions: {}
})
