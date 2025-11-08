import type { LoginForm, RegisterForm, UserInfo } from '@/type/user'
import request from '@/utils/request'

export const loginAPI = (data: LoginForm) => {
  return request.post('/user/login', data)
}

export const getUserInfoAPI = () => {
  return request.get('/user/info')
}

export const editUserInfoAPI = (data: UserInfo) => {
  return request.post('/user/edit', data)
}

export const sendPhoneCodeAPI = (phone: string) => {
  return request.get('/user/sendCode', {
    params: {
      phone
    }
  })
}

export const signupAPI = (data: RegisterForm) => {
  return request.post('/user/signup', data)
}
