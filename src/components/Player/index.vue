<template>
  <div class="player-container" :style="{padding: animateState !== 'bigger' ? '0px 5px' : ''}">
    <!--song info area-->
    <div ref="infoBox" class="info-container">
      <div ref="coverBox" class="small-cover-container" :style="{marginRight: props.animateState !== 'bigger' ? 0 : '12px'}">
        <img ref="coverRef" :src="songInfo.cover" alt="">
      </div>
      <div ref="titleBox" class="title-container">
        <p class="title-style" :style="titleStyle()">{{ songInfo.title }}</p>
        <p v-show="props.animateState === 'bigger'" class="song-style">{{ songInfo.author }}</p>
      </div>
      <div v-show="props.animateState !== 'smaller'" ref="waveRef" class="wave-container" />
    </div>
    <!--progress area-->
    <div v-show="props.animateState === 'bigger'" class="operation-container">
      <div ref="track" class="track">0:00</div>
      <div ref="progressBox" class="progress" @click="seek">
        <div class="progress-back">
          <div ref="progress" class="progress-front" />
        </div>
      </div>
      <div ref="duration" class="duration">{{ songInfo.duration }}</div>
    </div>
    <!--control area-->
    <div v-if="props.animateState === 'bigger'" class="control-container">
      <div class="previous btn" @click="previous" />
      <div v-if="playState" class="play btn" @click="toggle" />
      <div v-else class="pause btn" @click="toggle" />
      <div class="next btn" style="margin-right: 0" @click="next" />
    </div>
  </div>
</template>

<script setup>
import SiriWave from 'siriwave'
import Player from '@/components/Player/player.js'
import anime from 'animejs'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import ColorThief from '@node_modules/colorthief/dist/color-thief.mjs'
// import song1 from '@/assets/audio/rave_digger.mp3'
// import song2 from '@/assets/audio/80s_vibe.mp3'
// import cover1 from '@/assets/cover1.png'
// import cover2 from '@/assets/cover2.png'
import pinia from '@/store/store'

import { storeToRefs } from 'pinia'

import { usePlayerStore } from '@/store/playerState.js'

const store = usePlayerStore(pinia)
const { title, author, cover, soundState } = storeToRefs(store)
const props = defineProps({
  animateState: {
    type: String,
    default: 'smaller'
  },
  // song list
  playList: {
    type: Array,
    default: () => []
  },
  // The volume of the specific track, from 0.0 to 1.0.
  volume: {
    type: Number,
    default: 0.5
  },
  // Set to true to force HTML5 Audio
  html5: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['play', 'pause', 'previous', 'next'])
const waveRef = ref()
const waveInstance = ref()
const coverRef = ref()
const colorPalette = ref([])
const playState = ref(true)
const playerInst = ref()
const track = ref()
const progress = ref()
const duration = ref()
const progressBox = ref()
const titleBox = ref()
const coverBox = ref()
const infoBox = ref()
const songInfo = reactive({
  title: props.playList[0].title,
  author: props.playList[0].author,
  duration: '0:00',
  cover: props.playList[0].cover
})
onMounted(async () => {
  await nextTick()
  initWave()
  initPlayer()
})
// auto toggle next song
watch(title, (newValue, oldValue) => {
  songInfo.title = title.value
  songInfo.author = author.value
  songInfo.cover = cover.value
  initWave().then(() => {
    startWave()
  })
})

// watch the dynamic player animation state
watch(
  () => props.animateState,
  async (newval) => {
    // await initWave()
    if (newval === 'bigger') {
      bigger()
      if (coverAnimation.value) stopCoverAnimate()
    }
    if (newval === 'smaller') {
      smaller()
      if (soundState.value === 'playing') {
        coverAnimate()
      }
    }
  })
function play () {
  if (props.animateState === 'smaller' && coverAnimation.value) {
    coverAnimation.value.play()
  }
  playerInst.value.play().then(res => {
    songInfo.title = res.title
    songInfo.author = res.author
    songInfo.cover = res.cover
    initWave()
    coverAnimate()
  })
}
function initPlayer () {
  // 此处添加target 查询目标dom
  playerInst.value = new Player(props.playList, track.value, progress.value, duration.value, props.html5)
  playerInst.value.volume(props.volume)
}
function stop () {
  if (props.animateState === 'smaller') {
    coverAnimation.value.pause()
  }
  playerInst.value.pause()
}
function initWave () {
  return new Promise((resolve) => {
    getImgColor().then(() => {
      if (waveInstance.value) {
        waveInstance.value.dispose()
      }
      waveInstance.value = new SiriWave({
        container: waveRef.value,
        width: 50,
        height: 50,
        style: 'ios',
        curveDefinition: colorPalette.value,
        autostart: false,
        speed: 0.1
      })
      resolve()
    })
  })
}
function startWave () {
  waveInstance.value.start()
}
function stopWave () {
  waveInstance.value.stop()
}
function getImgColor () {
  return new Promise((resolve, reject) => {
    const colorThief = new ColorThief()
    const img = coverRef.value
    img.addEventListener('load', function () {
      const colorList = colorThief.getPalette(img)
      if (colorList.length) {
        colorPalette.value = [
          { attenuation: -2, lineWidth: 3, opacity: 1, color: colorList[0].join(',') },
          { attenuation: 2, lineWidth: 3, opacity: 1, color: colorList[1].join(',') },
          { attenuation: 1, lineWidth: 2, opacity: 1, color: colorList[2].join(',') },
          { attenuation: 1, lineWidth: 2, opacity: 1, color: colorList[3].join(',') }
        ]
        resolve()
      }
    })
  })
}
function toggle () {
  if (playState.value) {
    startWave()
    play()
    emit('play')
  } else {
    stopWave()
    stop()
    emit('pause')
  }
  playState.value = !playState.value
}
function next () {
  playerInst.value.skip('next').then(res => {
    songInfo.title = res.title
    songInfo.author = res.author
    songInfo.cover = res.cover
    songInfo.duration = res.duration
    emit('next')
    initWave().then(() => {
      startWave()
    })
  })
  playState.value = false
}
function previous () {
  playerInst.value.skip('prev').then(res => {
    songInfo.title = res.title
    songInfo.author = res.author
    songInfo.cover = res.cover
    songInfo.duration = res.duration
    emit('previous')
    // when toggle next song, init the wave
    initWave().then(() => {
      startWave()
    })
  })
  playState.value = false
}
function seek (event) {
  playerInst.value.seek(event.offsetX / progressBox.value.clientWidth)
}
// when island is bigger
function bigger () {
  const text = titleBox.value
  text.classList.add('animateText')
  anime({
    targets: coverBox.value,
    width: [
      { value: 60, duration: 200, easing: 'easeInSine' }
    ],
    height: [
      { value: 60, duration: 200, easing: 'easeInSine' }
    ],
    top: [
      { value: 0, duration: 200, easing: 'easeInSine' }
    ],
    easing: 'linear',
    duration: 200
  })
  anime({
    targets: infoBox.value,
    height: [
      { value: 65, duration: 200, easing: 'easeInSine' }
    ],
    easing: 'linear',
    duration: 200
  })
  anime({
    targets: coverRef.value,
    borderRadius: [
      { value: 10, duration: 200, easing: 'easeInSine' }
    ],
    easing: 'linear',
    duration: 200
  })
}
// when island is smaller
function smaller () {
  anime({
    targets: coverBox.value,
    width: [
      { value: 26, duration: 200, easing: 'easeInSine' }
    ],
    height: [
      { value: 26, duration: 200, easing: 'easeInSine' }
    ],
    top: [
      { value: 12, duration: 200, easing: 'easeInSine' }
    ],
    /* rotate: {
      value: 360,
      duration: 2000,
      easing: 'linear'
    }, */
    easing: 'linear',
    duration: 200
  })
  anime({
    targets: infoBox.value,
    height: [
      { value: 50, duration: 200, easing: 'easeInSine' }
    ],
    easing: 'linear',
    duration: 200
  })
  anime({
    targets: coverRef.value,
    borderRadius: [
      { value: 33, duration: 200, easing: 'easeInSine' }
    ],
    easing: 'linear',
    duration: 200
  })
}
function titleStyle () {
  return {
    fontSize: props.animateState !== 'bigger' ? '13px' : '',
    width: props.animateState !== 'bigger' ? '140px' : '145px',
    textAlign: props.animateState !== 'bigger' ? 'center' : 'left'
  }
}
const coverAnimation = ref(null)
function coverAnimate () {
  coverAnimation.value = anime({
    targets: coverBox.value,
    rotate: {
      value: 360,
      duration: 2000,
      easing: 'linear'
    },
    loop: true,
    easing: 'linear',
    duration: 200
  })
}
function stopCoverAnimate () {
  anime.set(coverBox.value, { rotate: 0 })
  coverAnimation.value.remove(coverBox.value)
}

function getState () {
  return soundState.value
}
function setVolume (val) {
  playerInst.value.volume(val)
}
function setMute (val) {
  playerInst.value.mute(val)
}
function seekBySeconds (val) {
  playerInst.value.seekBySeconds(val)
}
defineExpose({
  /** @description get sound state */
  getState,
  /** @description set sound volume */
  setVolume,
  /** @description set sound mute */
  setMute,
  /** @description skip to the song by seconds */
  seekBySeconds,
  /** @description play or pause the song */
  toggle,
  /** @description toggle next the song */
  next,
  /** @description toggle previous the song */
  previous
})
</script>

<style lang="scss" scoped>
@keyframes messageFilter {
  0% {
    transform: scale(0);
    transform: translateY(-10px);
    filter: blur(2px);
  }
  100% {
    transform: scale(1);
    transform: translateY(0px);
  }
}
.animateText {
  animation: messageFilter 300ms linear;

}
.player-container {
  font-size: 16px;
  color: #ffffff;
  padding: 16px;
  .info-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    height: 45px;
    .cover-container {
      //width: rem(60);
      //height: rem(60);
      margin-right: 16px;
      img {
        border-radius: 10px;
        width: 100%;
      }
    }
    .small-cover-container {
      width: 25px;
      height: 25px;
      position: absolute;
      left: 5px;
      top: 12px;
      img {
        border-radius: 30px;
        width: 100%;
      }
    }
    .title-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: fixed;
      p {
        margin: 0;
      }
      .song-style {
        width: 140px;
        color: #b2b2b2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
      }
      .title-style {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .wave-container {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      position: absolute;
      right: 0;
    }
    .small-wave-container {
      width: 30px;
      height: 30px;
      border-radius: 30px;
    }
  }
  .operation-container {
    display: flex;
    font-size: 8px;
    color: #b2b2b2;
    font-weight: 600;
    justify-content: space-around;
    margin-top: 8px;
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    .progress {
      width: 200px;
      display: flex;
      align-items: center;
      margin: 0 10px;
      .progress-back {
        width: 100%;
        height: 5px;
        border-radius: 3px;
        background: rgba(178, 178, 178, 0.34);
        .progress-front {
          width: 0%;
          height: 100%;
          border-radius: 3px;
          background: #ffffff;
        }
      }
    }
    .duration {
      width: 25px;
    }
  }
  .control-container {
    display: flex;
    justify-content: center;
    margin-top: 8px;
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    .btn {
      width: 32px;
      height: 32px;
      margin-right: 32px;
    }
    .previous {
      background: url("../../assets/ios-rewind.svg");
      background-size: contain;
    }
    .next {
      background: url("../../assets/ios-fastforward.svg");
      background-size: contain;
    }
    .play {
      background: url("../../assets/ios-play.svg");
      background-size: contain;
    }
    .pause {
      background: url("../../assets/ios-pause.svg");
      background-size: contain;
    }
  }
}
</style>
