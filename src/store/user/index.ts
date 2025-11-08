import { getUserInfoAPI, loginAPI } from '@/api/user'
import type { LoginForm, UserState } from '@/type/user'
import { message } from '@/utils'
import { defineStore } from 'pinia'

const userStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: undefined
  }),
  actions: {
    async login(data: LoginForm) {
      const res = await loginAPI(data)
      if (res.data.code === 200) {
        this.token = res.data.data
        localStorage.setItem('token', this.token)
        return true
      }
      return false
    },
    logout() {
      this.token = ''
      localStorage.removeItem('token')
      setTimeout(() => {
        message({
          type: 'success',
          message: '退出成功'
        })
        location.reload()
      }, 1000)
    },
    async getUserInfo() {
      if (this.token) {
        const res = await getUserInfoAPI()
        if (res.data.code === 200) {
          this.userInfo = res.data.data
        }
      }
    }
  }
})

export default userStore
