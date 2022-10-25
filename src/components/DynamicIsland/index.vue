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
  count.value = 30
  timer.value = setInterval(() => {
    console.log(count.value)
    count.value-- // 递减
    if (count.value <= 0) {
      animeSmall()
      clearInterval(timer.value)
    }
  }, 1000)
}
</script>
<style lang="scss" scoped>
$vm_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return calc($px / $vm_fontsize ) * 1rem;
}

// 根元素大小使用 vw 单位
$vm_design: 750;
html {
  font-size: calc($vm_fontsize / ($vm_design / 2)) * 100vw;
  // 同时，通过Media Queries 限制根元素最大最小值
  @media screen and (max-width: 320px) {
    font-size: 64px;
  }
  @media screen and (min-width: 540px) {
    font-size: 108px;
  }
}
* {
  margin: 0;
  padding: 0;
}
#iphone14pro {
  position: relative;
  margin: auto;
  width: rem(390);
  height: rem(344);
  overflow: hidden;
  background-image: url(https://www.apple.com.cn/v/iphone-14-pro/a/images/overview/dynamic-island/dynamic_hw__btl4fomgspyu_large.png);
  background-size: 100% 100%;
}
.dynamic-island {
  width: rem(180);
  margin-top: rem(25);
  margin: rem(25) auto 0;
  height: rem(45);
  border-radius: rem(40);
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
    width: rem(300);
  }
  80% {
    transform: scaleX(1.04);
  }
  100% {
    transform: scaleX(1);
    width: rem(300);
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
    width: rem(320);
    height: rem(150);
    border-radius: rem(40);
  }
  80% {
    transform: scaleX(1.04);
  }
  100% {
    width: rem(320);
    height: rem(150);
    border-radius: rem(40);
    transform: scaleX(1);
  }
}
.bigger::after {
  display: none;
}
</style>
