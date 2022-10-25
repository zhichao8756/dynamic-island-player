<template>
  <div>
    <div ref="dynamic" class="dynamic-island" @click="start">
      <Player :animate-state="animationState" />
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref } from 'vue'
import anime from 'animejs'
import Player from '@/components/Player/index.vue'

const dynamic = ref()
const animationState = ref('smaller')
const timer = ref(null)
const count = ref(0)

onMounted(async () => {
  await nextTick()
})
function start () {
  clearInterval(timer.value)
  isClick()
  if (animationState.value === 'smaller') {
    animeLong()
  } else if (animationState.value === 'longer') {
    animeBig()
  }
}
function animeSmall () {
  animationState.value = 'smaller'
  anime({
    targets: '.dynamic-island',
    keyframes: [
      { width: 187, height: 50, duration: 280 },
      { scaleX: 1.04, duration: 160 },
      { scaleX: 1, duration: 160 }
    ],
    easing: 'easeInOutSine',
    complete: function () {
      // animationState.value = 'smaller'
    }
  })
}

// 灵动岛对应dom
function animeLong () {
  anime({
    targets: '.dynamic-island',
    keyframes: [
      { width: 290, height: 50, duration: 280 },
      { scaleX: 1.04, duration: 160 },
      { scaleX: 1, duration: 160 }
    ],
    easing: 'easeInOutSine',
    complete: function () {
      animationState.value = 'longer'
    }
  })
}
function animeBig () {
  anime({
    targets: '.dynamic-island',
    keyframes: [
      { width: 340, height: 170, borderRadius: 40, duration: 160 },
      { scaleX: 1.04, duration: 160 },
      { scaleX: 1, duration: 160 }
    ],
    easing: 'easeInOutSine',
    complete: function () {
      animationState.value = 'bigger'
    }
  })
}
// 如果长时间不操作, 恢复到原始的状态
function isClick () {
  count.value = 10
  // count.value = 3
  timer.value = setInterval(() => {
    count.value-- // 递减
    if (count.value <= 0) {
      animeSmall()
      clearInterval(timer.value)
    }
  }, 1000)
}
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.dynamic-island {
  width: 187px;
  height: 45px;
  border-radius: 40px;
  background-color: #272729;
  position: relative;
}
/* 变长 */
.longer {
  animation: longer 800ms ease-in-out forwards;
}
@keyframes longer {
  0% {
  }
  60% {
    width: 300px;
  }
  80% {
    transform: scaleX(1.04);
  }
  100% {
    transform: scaleX(1);
    width: 300px;
  }
}
/* 变大 */
.bigger {
  animation: bigger 800ms ease-in-out forwards;
}
@keyframes bigger {
  0% {
  }
  60% {
    width: 320px;
    height: 150px;
    border-radius: 40px;
  }
  80% {
    transform: scaleX(1.04);
  }
  100% {
    width: 320px;
    height: 150px;
    border-radius: 40px;
    transform: scaleX(1);
  }
}
.bigger::after {
  display: none;
}
</style>
