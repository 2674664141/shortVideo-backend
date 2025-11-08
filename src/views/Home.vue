<template>
  <div class="home" id="home">
    <LeftNavigation></LeftNavigation>
    <Header></Header>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <Sign v-show="store.showLoginModal"></Sign>
  </div>
</template>

<script setup lang="ts">
import Header from '@/common/Header.vue'
import LeftNavigation from '@/common/LeftNavigation.vue'
import Sign from '@/components/home/Sign.vue'
import homeStore from '@/store/home'

const store = homeStore()
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;

  .main-content {
    width: calc(100vw - var(--xz-navigation-width));
    margin-left: var(--xz-navigation-width);
    padding-top: var(--xz-header-height);
    height: 100%;
    background-color: var(--xz-card-bg);
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  padding: 0 40px;

  .login-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    position: relative;

    .nav-item {
      height: 40px;
      line-height: 40px;
      margin-right: 20px;
      position: relative;
      cursor: pointer;

      &.active::before {
        bottom: 0;
        content: '';
        display: block;
        height: 3px;
        position: absolute;
        width: 100%;
        background-color: #1772f6;
      }

      span {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .form-item {
    display: flex;
    align-items: center;
  }
}
</style>
