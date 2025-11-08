import userStore from '@/store/user'
import axios from 'axios'

// 全局请求变量
const request = axios.create({
  baseURL: 'http://localhost:8080', // 接口请求的基础地址
  timeout: 60000 // 1分钟超时
})

// 请求拦截器，在请求发起前做一些处理
request.interceptors.request.use((config) => {
  // 在请求发起前做一些处理
  const store = userStore()
  const token = store.token
  if (token) {
    config.headers.set('Authorization', token)
  }
  return config
})

// 请求响应后的拦截器，在响应数据返回后先做一些处理
request.interceptors.response.use(
  (response) => {
    // 在响应数据返回后做一些处理
    // 输出响应的数据
    const { code, message } = response.data
    console.log(response.data, message)
    switch (code) {
      case 200:
        break
      case 401:
        message({
          message: '操作失败，请先登录',
          type: 'error'
        })
        return response
      default:
        break
    }
    return response
  },
  (error) => {
    // 响应错误处理
    return Promise.reject(error)
  }
)

export default request
