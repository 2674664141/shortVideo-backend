<script setup lang="ts">
import { onMounted } from 'vue'
import userStore from './store/user'

const store = userStore()

onMounted(() => {
  store.getUserInfo()
})
</script>

<template>
  <router-view></router-view>
</template>

<style>
.el-popper.is-pure {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.el-popper.is-light {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.el-popper__arrow {
  display: none !important;
}
</style>
