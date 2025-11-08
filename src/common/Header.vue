<template>
  <div class="header">
    <div class="header-container">
      <div class="search-container">
        <div class="search-input">
          <input
            @keydown.enter="handleToSearch"
            v-model="searchContent"
            maxlength="50"
            class="input"
            type="text"
            placeholder="请输入感兴趣的内容"
          />
          <div class="search-icon">
            <i class="ri-search-line"></i>
          </div>
        </div>
        <div class="search-history"></div>
      </div>
      <div class="user-container">
        <div @click="handleToggleTheme" class="navigation-item">
          <div class="navigation">
            <div class="navigation-icon">
              <i v-show="hStore.theme === 'dark'" class="ri-sun-line"></i>
              <i v-show="hStore.theme === 'light'" class="ri-moon-clear-line"></i>
            </div>
            <p>主题</p>
          </div>
        </div>
        <div class="navigation-item">
          <div class="navigation">
            <div class="navigation-icon">
              <i class="ri-notification-line"></i>
            </div>
            <p>通知</p>
          </div>
        </div>
        <div class="navigation-item">
          <div class="navigation">
            <div class="navigation-icon">
              <i class="ri-chat-3-line"></i>
            </div>
            <p>私信</p>
          </div>
        </div>
        <div class="navigation-item">
          <div class="navigation" @click="handleToTouGao">
            <div class="navigation-icon">
              <i class="ri-function-add-fill"></i>
            </div>
            <p>投稿</p>
          </div>
        </div>
        <div class="user-info">
          <div class="user-avatar-head user-avatar" v-show="store.token">
            <img :src="store.userInfo?.avatar" alt="" class="avatar" />
          </div>
          <div class="user-info-detail" v-show="store.token">
            <div class="user-info-detail-item">
              <div class="user-avatar">
                <img :src="store.userInfo?.avatar" alt="" class="avatar" />
              </div>
              <div>
                <div class="user-info-name">
                  {{ store.userInfo?.userName }}
                </div>
                <div class="user-info-follow">
                  <span class="user-info-following"
                    >关注 {{ store.userInfo?.userProfile.followingCount }}</span
                  >
                  <span class="user-info-follower"
                    >粉丝 {{ store.userInfo?.userProfile.followerCount }}</span
                  >
                </div>
              </div>
            </div>
            <div class="nav-item">
              <div class="nav-header">
                <div class="nav-icon">
                  <i class="ri-heart-line icon"></i>
                  <span class="nav-text">我的喜欢</span>
                </div>
                <div class="nav-count">
                  <span class="count">{{ store.userInfo?.userProfile.likeCount }}</span>
                  <i class="ri-arrow-right-s-line"></i>
                </div>
              </div>
            </div>
            <div class="action">
              <div @click="handleLogout" class="logout flex flex-center">
                <i class="ri-logout-box-line"> </i>
                <span>退出登录</span>
              </div>
            </div>
          </div>
          <div @click="handleToLogin" v-show="!store.token" class="btn danger">登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import homeStore from '@/store/home'
import userStore from '@/store/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = userStore()

const hStore = homeStore()

const searchContent = ref('')

const handleToTouGao = () => {
  router.push('/create')
}

const handleToLogin = () => {
  hStore.showLogin()
}

const handleToggleTheme = () => {
  if (hStore.theme === 'dark') {
    hStore.theme = 'light'
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  } else {
    hStore.theme = 'dark'
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  }
}

const handleLogout = () => {
  store.logout()
}

const handleToSearch = (e: KeyboardEvent) => {
  if (e.isComposing) {
    return
  }
  router.push({
    path: '/search',
    query: {
      q: searchContent.value
    }
  })
  searchContent.value = ''
}
</script>

<style scoped>
.header {
  height: var(--xz-header-height);
  /* width: calc(100vw - var(--xz-navigation-width)); */
  width: 100%;
  position: fixed;
  top: 0;
  right: 0;
  background-color: var(--xz-card-bg);
  z-index: 9;

  .header-container {
    padding: 6px 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .search-container {
      border-radius: var(--xz-main-radius);
      background-color: var(--xz-card-bg);
      border: 1px solid var(--xz-card-border);
      padding: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .search-input {
        height: 32px;
        width: fit-content;
        display: flex;
        align-items: center;

        .input {
          background: transparent;
          text-indent: 8px;
          border: none;
          outline: none;
          display: block;
          font-size: 16px;
          width: 220px;
          height: 30px;
          color: var(--xz-fontcolor);
          border-radius: var(--xz-main-radius);
        }

        .search-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 4px;
          transition: all 0.3s ease;
          border-radius: 4px;
          width: 32px;
          height: 32px;

          &:hover {
            background-color: var(--xz-secondbg);
          }

          i {
            font-size: 16px;
          }
        }
      }
    }
  }

  .user-container {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    gap: 20px;
    align-items: center;
    height: 100%;
    padding-right: 10px;

    .navigation-item {
      display: flex;
      cursor: pointer;

      &:hover {
        p,
        i {
          transition: all 0.3s ease;
          color: var(--xz-fontcolor) !important;
        }
      }

      .navigation {
        display: flex;
        flex-direction: column;
        align-items: center;

        i {
          color: var(--xz-secondtext);
        }

        p {
          font-size: 12px;
          font-weight: 500;
          line-height: 20px;
          color: var(--xz-secondtext);
          word-break: keep-all;
          text-align: center;
        }
      }
    }

    .user-info {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      position: relative;

      .user-avatar-head:hover {
        ~ .user-info-detail {
          display: block;
        }
      }

      .user-info-detail {
        display: none;
        overflow: hidden;
        transition: all 0.3s ease;
        position: absolute;
        width: 320px;
        background-color: var(--xz-secondbg);
        padding: 10px 20px;
        border-radius: 12px;
        top: calc(100% - 10px);
        right: 10px;

        &:hover {
          display: block;
        }

        .user-info-detail-item {
          display: flex;
          align-items: center;
          width: 100%;

          .user-avatar {
            margin-right: 20px;
            height: 50px;
            width: 50px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .user-info-name {
            margin-bottom: 8px;
          }

          .user-info-follow {
            color: var(--xz-secondtext);
            font-size: 14px;
            display: flex;
            gap: 10px;
            align-items: center;
          }
        }

        .nav-item {
          margin-top: 10px;
          width: 100%;
          background-color: var(--xz-card-btn-bg);
          padding: 10px;
          border-radius: var(--xz-main-radius);

          .nav-header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .nav-icon {
              display: flex;
              align-items: center;
              gap: 5px;
            }

            .nav-count {
              color: var(--xz-secondtext);
              font-size: 14px;
            }
          }
        }

        .action {
          width: 100%;
          margin-top: 10px;
          padding-top: 10px;
          border-top: var(--style-border);
          display: flex;
          align-items: center;
          color: var(--xz-secondtext);

          .logout {
            gap: 6px;
            cursor: pointer;
            width: fit-content;
          }
        }
      }

      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
    }
  }
}
</style>
