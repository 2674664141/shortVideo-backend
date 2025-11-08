<template>
  <div class="fensi">
    <div class="fensi-container">
      <div class="title">我的粉丝</div>
      <div class="fensi-list">
        <div
          class="fensi-item"
          @click="handleToUserIndex(item.followerId)"
          v-for="item in guanzhuList"
          :key="item.id"
        >
          <div class="user-avatar">
            <img :src="item.followerAvatar" alt="" />
          </div>
          <div class="user-info">
            <div class="user-name">{{ item.followerName }}</div>
            <div class="user-desc">{{ item.followerSignature }}</div>
            <div @click="handleFollow(item)" class="btn danger">
              {{ item.isMutualFollow ? '已互粉' : '回关' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { followAPI, getFollowersAPI } from '@/api/follow'
import userStore from '@/store/user'
import type { FollowVO } from '@/type/follow'
import { message } from '@/utils'
import { onMounted, ref } from 'vue'

const guanzhuList = ref<FollowVO[]>([])

const uStore = userStore()

const handleToUserIndex = (followingId: number) => {
  console.log(followingId)
}

const handleFollow = async (item: FollowVO) => {
  const res = await followAPI(item.followerId)
  if (res.data.code === 200) {
    message({
      type: 'success',
      message: item.isMutualFollow ? '关注成功' : '回关成功'
    })
    uStore.getUserInfo()
    getFollowersList()
  }
}

const getFollowersList = async () => {
  const res = await getFollowersAPI()
  if (res.data.code === 200) {
    guanzhuList.value = res.data.data
    console.log(guanzhuList.value)
  }
}

onMounted(() => {
  getFollowersList()
})
</script>

<style scoped>
.fensi {
  padding: 10px 20px;
  padding-right: 10px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .fensi-container {
    width: 100%;

    .title {
      font-weight: bold;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .fensi-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;

      .fensi-item {
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
