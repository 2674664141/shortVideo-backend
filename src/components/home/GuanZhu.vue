<template>
  <div class="guanzhu">
    <div class="guanzhu-container">
      <div class="title">我的关注</div>
      <div class="guanzhu-list">
        <div
          class="guanzhu-item"
          @click="handleToUserIndex(item.followingId)"
          v-for="item in guanzhuList"
          :key="item.id"
        >
          <div class="user-avatar">
            <img :src="item.followingAvatar" alt="" />
          </div>
          <div class="user-info">
            <div class="user-name">{{ item.followingName }}</div>
            <div class="user-desc">{{ item.followingSignature }}</div>
            <div @click="handleCancelFollow(item.followingId)" class="btn danger">取消关注</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { followAPI, getFollowingAPI } from '@/api/follow'
import userStore from '@/store/user'
import type { FollowVO } from '@/type/follow'
import { message } from '@/utils'
import { onMounted, ref } from 'vue'

const guanzhuList = ref<FollowVO[]>([])

const uStore = userStore()

const handleToUserIndex = (followingId: number) => {
  console.log(followingId)
}

const handleCancelFollow = async (followingId: number) => {
  const res = await followAPI(followingId)
  if (res.data.code === 200) {
    message({
      type: 'success',
      message: '取消关注成功'
    })
    uStore.getUserInfo()
    getFollowList()
  }
}

const getFollowList = async () => {
  const res = await getFollowingAPI()
  if (res.data.code === 200) {
    guanzhuList.value = res.data.data
  }
}

onMounted(() => {
  getFollowList()
})
</script>

<style scoped>
.guanzhu {
  padding: 10px 20px;
  padding-right: 10px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .guanzhu-container {
    width: 100%;

    .title {
      font-weight: bold;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .guanzhu-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;

      .guanzhu-item {
        width: calc(25% - 15px);
        height: 150px;
        display: flex;
        padding: 16px 0;

        .user-avatar {
          height: 80px;
          width: 80px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .user-info {
          width: calc(100% - 96px);
          margin-left: 16px;
          display: flex;
          flex-direction: column;
          height: 100%;

          .user-name {
            font-weight: bold;
            font-size: 1.2rem;
          }

          .user-desc {
            text-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.8rem;
            color: var(--xz-secondtext);
            margin-bottom: 12px;
          }
        }
      }
    }
  }
}
</style>
