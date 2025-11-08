<template>
  <div class="content-wrap">
    <div @click="handleCloseSign" class="close-icon">
      <i class="ri-close-line"></i>
    </div>
    <div class="login-wrap">
      <div class="login-tab">
        <div
          @click="handleTabChange('login')"
          :class="currentTab === 'login' ? 'login-tab-item active-tab' : 'login-tab-item'"
        >
          登录
        </div>
        <div class="login-tab-line"></div>
        <div
          @click="handleTabChange('register')"
          :class="currentTab === 'register' ? 'login-tab-item active-tab' : 'login-tab-item'"
        >
          注册
        </div>
      </div>
      <div v-show="currentTab === 'login'" class="login-container">
        <form class="tab-form login-tab-form">
          <div class="form-item">
            <div class="form-info">账号</div>
            <input
              autocomplete="on"
              maxlength="32"
              type="text"
              placeholder="请输入账号/手机号/邮箱"
              v-model="loginForm.account"
            />
          </div>
          <div class="form-separator-line"></div>
          <div class="form-item">
            <div class="form-info">密码</div>
            <input
              v-model="loginForm.password"
              maxlength="32"
              autocomplete="on"
              type="password"
              placeholder="请输入密码"
            />
            <div class="eye-btn" style="--thememini-color: #00a1d6">
              <svg
                data-v-1932284b=""
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  data-v-1932284b=""
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 7.45886 17.3001 7.12696 17.5753 6.85456Z"
                  fill="#9499A0"
                ></path>
              </svg>
            </div>
            <div class="clickable">忘记密码?</div>
          </div>
        </form>
        <div class="btn-wrap">
          <div @click="handleLogin" class="btn primary">登录</div>
        </div>
      </div>
      <div v-show="currentTab === 'register'" class="sign-container">
        <form class="tab-form register-tab-form">
          <div class="form-item">
            <div class="form-info">用户名</div>
            <input
              v-model="registerForm.userName"
              maxlength="32"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <div class="form-separator-line"></div>
          <div class="form-item">
            <div class="form-info">密码</div>
            <input
              v-model="registerForm.password"
              maxlength="32"
              type="password"
              placeholder="请输入密码"
            />
            <div class="eye-btn" style="--thememini-color: #00a1d6">
              <svg
                data-v-1932284b=""
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  data-v-1932284b=""
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 7.45886 17.3001 7.12696 17.5753 6.85456Z"
                  fill="#9499A0"
                ></path>
              </svg>
            </div>
          </div>
          <div class="form-separator-line"></div>
          <div class="form-item">
            <div class="form-info">重复密码</div>
            <input
              v-model="registerForm.repeatPassword"
              maxlength="32"
              autocomplete="on"
              type="password"
              placeholder="请重复密码"
            />
            <div class="eye-btn" style="--thememini-color: #00a1d6">
              <svg
                data-v-1932284b=""
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  data-v-1932284b=""
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 7.45886 17.3001 7.12696 17.5753 6.85456Z"
                  fill="#9499A0"
                ></path>
              </svg>
            </div>
          </div>
          <div class="form-separator-line"></div>
          <div class="form-item">
            <div class="form-info">手机号</div>
            <input
              v-model="registerForm.phone"
              autocomplete="on"
              maxlength="11"
              type="text"
              placeholder="请输入手机号"
            />
            <button
              @click.prevent="handleSendPhoneCode"
              :disabled="isSending"
              style="
                background-color: rgb(66, 90, 239);
                border: none;
                color: white;
                padding: 5px 10px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 5px;
              "
            >
              {{ isSending ? `${phoneCodeTime}s后重发` : '发送验证码' }}
            </button>
          </div>
          <div class="form-separator-line"></div>
          <div class="form-item">
            <div class="form-info">验证码</div>
            <input
              v-model="registerForm.phoneCode"
              autocomplete="on"
              maxlength="32"
              type="text"
              placeholder="请输入手机验证码"
            />
          </div>
        </form>
        <div class="btn-wrap">
          <div @click="handleSignup" class="btn primary">注册</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendPhoneCodeAPI, signupAPI } from '@/api/user'
import homeStore from '@/store/home'
import userStore from '@/store/user'
import type { LoginForm, RegisterForm } from '@/type/user'
import { message } from '@/utils'
import { ref } from 'vue'
const currentTab = ref<string>('login')

const hStore = homeStore()

const uStore = userStore()

const phoneCodeTime = ref<number>(60)

const isSending = ref<boolean>(false)

const loginForm = ref<LoginForm>({
  account: '',
  password: ''
})

const registerForm = ref<RegisterForm>({
  password: '',
  phone: '',
  userName: '',
  repeatPassword: '',
  phoneCode: ''
})

const handleTabChange = (tab: string) => {
  currentTab.value = tab
}

const handleSendPhoneCode = async () => {
  const res = await sendPhoneCodeAPI(registerForm.value.phone)
  if (res.data.code === 200) {
    isSending.value = true
    message({
      type: 'success',
      message: '验证码发送成功'
    })
    const interval = setInterval(() => {
      phoneCodeTime.value--
      if (phoneCodeTime.value === 0) {
        isSending.value = false
        phoneCodeTime.value = 60
        clearInterval(interval)
      }
    }, 1000)
  }
}

const handleSignup = async () => {
  const res = await signupAPI(registerForm.value)
  if (res.data.code === 200) {
    message({
      type: 'success',
      message: '注册成功'
    })
    setTimeout(() => {
      location.reload()
    }, 1000)
  }
}

const handleLogin = async () => {
  const isLogin = await uStore.login(loginForm.value)
  if (isLogin) {
    message({
      type: 'success',
      message: '登录成功'
    })
    return setTimeout(() => {
      location.reload()
    }, 1000)
  }
  return message({
    type: 'error',
    message: '登录失败'
  })
}

// const handleRegister = () => {
//   store.handleRegister(registerForm.value);
// };

const handleCloseSign = () => {
  hStore.hideLogin()
}
</script>

<style scoped lang="scss">
.content-wrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 820px;
  min-height: 430px;
  background: var(--xz-card-bg);
  border-radius: 8px;
  padding: 52px 65px 29px 92px;
  // background-image: url(https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/img/22_open.4ea5f239.png),
  //   url(https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/img/33_open.f7d7f655.png);
  background-position: 0 100%, 100% 100%;
  background-repeat: no-repeat, no-repeat;
  background-size: 14%;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  z-index: 9999;
}

.close-icon {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 20px;
  right: 20px;
  color: var(--xz-fontcolor);
  cursor: pointer;
  z-index: 2;

  i {
    font-size: 32px;
  }
}

.login-wrap {
  width: 400px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.login-tab {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 24px;
}

.login-tab-line {
  width: 1px;
  height: 20px;
  background: #e3e5e7;
  border-radius: 8px;
  margin: 0 21px;
}

.login-tab-item {
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  cursor: pointer;

  &.active-tab {
    color: #4fa5d9;
    cursor: not-allowed;
  }
}

.tab-form {
  width: 400px;
  // border: 1px solid #e3e5e7;
  border: var(--style-border);
  border-radius: 8px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  &.login-tab-form {
    height: 90px;
  }

  &.register-tab-form {
    height: 225px;
  }

  .form-separator-line {
    display: block;
    width: 100%;
    height: 0;
    border-bottom: var(--style-border);
  }

  .form-item {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 44px;
    padding: 12px 20px;

    .form-info {
      width: 60px;
    }

    input {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      min-width: 0;
      // -webkit-box-shadow: 0 0 0 1000px #fff inset;
      // box-shadow: inset 0 0 0 1000px #fff;
      background: transparent;
      margin-left: 20px;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      outline: none;
      border: none;
      overflow: visible;
      color: var(--xz-fontcolor);
    }

    .eye-btn {
      width: 20px;
      height: 20px;
      position: relative;
      display: inline-block;
      cursor: pointer;
      margin-right: 10px;
    }
  }
}

.btn-wrap {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-top: 20px;
  width: 400px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 40px;
  text-align: center;

  .btn {
    width: 100%;
  }
}

// .btn.primary {
//   -webkit-box-sizing: border-box;
//   box-sizing: border-box;
//   width: 100%;
//   height: 40px;
//   cursor: pointer;
//   color: #fff;
//   background: #00aeec;
//   border-radius: 8px;
// }
</style>
