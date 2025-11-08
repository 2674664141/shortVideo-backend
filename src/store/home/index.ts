import type { HomeState } from '@/type'
import { defineStore } from 'pinia'

const homeStore = defineStore('home', {
  state: (): HomeState => ({
    showLoginModal: false,
    jingxuanVideoList: [],
    theme: 'dark'
  }),
  actions: {
    showLogin() {
      this.showLoginModal = true
    },
    hideLogin() {
      this.showLoginModal = false
    }
  }
})

export default homeStore
