<template>
  <div id="iphone14pro">
    <div ref="dynamic" class="dynamic-island" />
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref } from 'vue'
import anime from 'animejs'
const dynamic = ref()
onMounted(async () => {
  await nextTick()
  init()
})
// 灵动岛对应dom
function init () {
  // const box = document.querySelector('.dynamic-island')

  const animationList = ['longer', 'bigger']
  dynamic.value.addEventListener('click', () => {
    dynamic.value.classList.add(animationList[index])
  })
  let index = 0
  // 每一个动画结束都会触发此事件（包括子元素及不同种类属性动画）
  dynamic.value.addEventListener('animationend', (e) => {
    index++
    setTimeout(() => {
      if (index <= animationList.length - 1) {
        dynamic.value.classList.add(animationList[index])
      } else {
        index = 0
      }
    }, 800)
  })
}

</script>
<style lang="scss" scoped>
$vm_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return ($px / $vm_fontsize ) * 1rem;
}

// 根元素大小使用 vw 单位
$vm_design: 750;
html {
  font-size: ($vm_fontsize / ($vm_design / 2)) * 100vw;
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
  width: rem(220);
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
