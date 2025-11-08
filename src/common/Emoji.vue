<template>
  <div v-show="props.show" class="emoji">
    <div class="emoji-list">
      <div
        @click="handleSelectEmoji(emoji)"
        class="emoji-item"
        v-for="emoji in EMOJI_LIST"
        :key="emoji.id"
      >
        <img :src="'/biaoqing/' + emoji.file" alt="" />
      </div>
    </div>
    <div @click="emits('update:show', false)" class="emoji-mask"></div>
  </div>
</template>

<script setup lang="ts">
import { EMOJI_LIST } from '@/constant/social'

const props = defineProps<{
  show: boolean
}>()

const handleSelectEmoji = (emoji: any) => {
  emits('selectEmoji', emoji)
  emits('update:show', false)
}

const emits = defineEmits(['update:show', 'selectEmoji'])
</script>

<style scoped>
.emoji {
  height: 200px;
  width: 100%;
  background-color: var(--xz-secondbg);
  padding: 20px;
  border-radius: 12px;

  .emoji-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .emoji-item {
      width: 60px;
      height: 60px;
    }
  }
}

.emoji-mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -1; /* 确保遮罩层在容器下方 */
  background: transparent;
}
</style>
