<template>
  <div>
    <div ref="dynamic" class="dynamic-island" :style="{background: isColor()}" @click="start">
      <div v-if="isColor().length === 0" :style="changeTheme()" />
      <Player
        v-if="playList.length"
        ref="player"
        :animate-state="animationState"
        :play-list="playList"
        :volume="volume"
        :html5="html5"
        @play="play"
        @pause="pause"
        @next="next"
        @previous="previous"
      />
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
const props = defineProps({
  playList: {
    type: Array,
    default: () => []
  },
  volume: {
    type: Number,
    default: 0.5
  },
  html5: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['play', 'pause', 'next', 'previous', 'animationSmall', 'animationBig', 'animationLong'])
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
  /** @description event dynamic island translate smaller */

  emit('animationSmall')
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
  /** @description event dynamic island translate longer */
  emit('animationLong')
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
  /** @description event dynamic island translate bigger */

  emit('animationBig')
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
function isColor () {
  if (props.theme[0] === '#') {
    return props.theme
  } else {
    return ''
  }
}
// change theme
function changeTheme () {
  const theme = {
    width: '100%',
    height: '100%',
    borderRadius: '40px',
    position: 'absolute',
    background: `url(${props.theme})`,
    backgroundSize: '100% 100%',
    filter: 'blur(3px)'
  }
  return theme
}
const player = ref()
/** *** @description expose  internal methods ******/

function getSoundState () {
  return player.value.getState()
}
function setVolume (val) {
  player.value.setVolume(val)
}
function setMute (val) {
  player.value.setMute(val)
}
function seekBySeconds (val) {
  player.value.seekBySeconds(val)
}
function toggle () {
  player.value.toggle()
}
function playNext () {
  player.value.next()
}
function playPrevious () {
  player.value.previous()
}
/** *** @description event emit ******/

function play () {
  /** @description event sound play */
  emit('play')
}
function pause () {
  /** @description event sound pause */
  emit('pause')
}
function next () {
  /** @description event next */
  emit('next')
}
function previous () {
  /** @description event  previous */
  emit('previous')
}
defineExpose({
  getSoundState,
  setVolume,
  setMute,
  seekBySeconds,
  toggle,
  playNext,
  playPrevious
})
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
