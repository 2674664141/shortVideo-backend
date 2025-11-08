<template>
  <div class="left-navigation">
    <div class="logo-container">
      <a @click="router.push('/')" class="logo"></a>
    </div>
    <div class="navigation-container container">
      <div class="navigation">
        <div class="navigation-group" v-for="group in NAVIGATION_GROUPS" :key="group.title">
          <div
            :class="`navigation-item ${currentActive === nav.path ? 'active' : ''}`"
            v-for="nav in group.navigations"
            :key="nav.text"
            @click="handleNavigationClick(nav)"
          >
            <a class="navigation-link">
              <i :class="nav.icon"></i>
              <div class="navigation-text">{{ nav.text }}</div>
            </a>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="setting">
      <div class="setting-container">
        <div class="setting-group" v-for="group in SETTING_GROUPS" :key="group.title">
          <div class="setting-item">
            <i :class="group.icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAVIGATION_GROUPS, SETTING_GROUPS } from '@/constant'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const currentActive = ref(NAVIGATION_GROUPS[0].navigations[0].path)

const router = useRouter()

const route = useRoute()

watch(
  () => route.path,
  (value) => {
    currentActive.value = value
  },
  {
    immediate: true
  }
)

const handleNavigationClick = (nav: { text: string; path: string; icon: string }) => {
  currentActive.value = nav.text
  router.push({
    path: nav.path
  })
}
</script>

<style scoped>
.left-navigation {
  background-color: var(--xz-card-bg);
  height: 100vh;
  width: fit-content;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;

  .logo-container {
    width: 100%;
    height: var(--xz-header-height);
    display: flex;
    justify-content: center;
    align-items: center;

    .logo {
      display: block;
      width: 100%;
      height: 100%;
      /* background: url(../assets/logo.png) no-repeat center; */
      background: url(/logo.png) no-repeat center;
      background-size: 56px;
    }
  }

  .navigation-container {
    width: var(--xz-navigation-width);
    height: calc(100vh - var(--xz-header-height) - 60px);
    overflow-x: hidden;
    overflow-y: scroll;

    .navigation {
      .navigation-group {
        width: 100%;
        padding: 0 16px;

        .navigation-item {
          border-radius: 12px;
          height: 40px;
          margin: 2px 0;
          transition: all 0.3s ease;

          &:hover {
            background-color: var(--xz-secondbg);
            color: var(--xz-white);
          }

          &.active {
            background-color: var(--xz-secondbg);
            color: var(--xz-white);
          }

          .navigation-link {
            display: flex;
            gap: 12px;
            align-items: center;
            padding: 8px 0 8px 16px;
            font-size: 16px;

            i {
              font-size: 16px;
            }
          }
        }

        .line {
          height: 1px;
          border-bottom: 1px solid var(--xz-theme-op);
          margin: 12px 15px 10px;
          margin-top: 12px;
          margin-bottom: 10px;
        }
      }
    }
  }

  .setting {
    height: 60px;
    width: 100%;
    padding: 14px 0 14px 24px;

    .setting-container {
      display: flex;
      gap: 8px;

      .setting-item {
        width: 32px;
        height: 32px;
        border-radius: var(--xz-main-radius);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
        position: relative;
        cursor: pointer;

        &:hover {
          background-color: var(--xz-secondbg);
        }

        i {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
