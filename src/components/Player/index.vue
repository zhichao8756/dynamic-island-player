<template>
  <div class="player-container" :style="{padding: animateState !== 'bigger' ? '0px 5px' : ''}">
    <!--song info area-->
    <div class="info-container">
      <div :class="props.animateState !== 'bigger' ? 'small-cover-container' : 'cover-container'">
        <img ref="coverRef" :src="songInfo.cover" alt="">
      </div>
      <div ref="titleBox" class="title-container">
        <p :style="{fontSize: animateState !== 'bigger' ? '13px' : ''}">{{ songInfo.title }}</p>
        <p v-show="props.animateState === 'bigger'" class="song-style">{{ songInfo.author }}</p>
      </div>
      <div ref="waveRef" :class="props.animateState !== 'bigger' ? 'wave-container' : 'wave-container'" />
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
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import ColorThief from '@node_modules/colorthief/dist/color-thief.mjs'
import song1 from '@/assets/audio/rave_digger.mp3'
import song2 from '@/assets/audio/80s_vibe.mp3'
import cover1 from '@/assets/cover1.png'
import cover2 from '@/assets/cover2.png'
import pinia from '@/store/store'

import { storeToRefs } from 'pinia'

import { usePlayerStore } from '@/store/playerState.js'
const store = usePlayerStore(pinia)
const { title, author, cover } = storeToRefs(store)

console.log(title.value)
const props = defineProps({
  animateState: {
    type: String,
    default: 'smaller'
  },
  playList: {
    type: Array,
    default: () => [
      {
        title: 'Rave Digger',
        file: song1,
        howl: null,
        author: 'Cherrystones',
        cover: cover1
      },
      {
        title: '80s Vibe',
        file: song2,
        howl: null,
        author: 'Tory Lanez',
        cover: cover2
      }
    ]
  }
})
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
  console.log(newValue)
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
    console.log(2233239999)
    // await initWave()
    if (newval === 'bigger') {
      bigger()
    }
  })
function play () {
  playerInst.value.play().then(res => {
    songInfo.title = res.title
    songInfo.author = res.author
    songInfo.cover = res.cover
    initWave()
  })
}
function initPlayer () {
  // 此处添加target 查询目标dom
  playerInst.value = new Player(props.playList, track.value, progress.value, duration.value)
}
function stop () {
  playerInst.value.pause()
}
function initWave () {
  return new Promise((resolve) => {
    getImgColor().then(() => {
      console.log(props.animateState)
      if (waveInstance.value) {
        waveInstance.value.dispose()
      }
      console.log(props.animateState)
      waveInstance.value = new SiriWave({
        container: waveRef.value,
        width: props.animateState === 'smaller' ? 50 : 50,
        height: props.animateState === 'smaller' ? 50 : 50,
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
    console.log(img)
    img.addEventListener('load', function () {
      const colorList = colorThief.getPalette(img)
      console.log(colorList)
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
  } else {
    stopWave()
    stop()
  }
  playState.value = !playState.value
}
function next () {
  playerInst.value.skip('next').then(res => {
    songInfo.title = res.title
    songInfo.author = res.author
    songInfo.cover = res.cover
    songInfo.duration = res.duration
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
function bigger () {
  const text = titleBox.value
  text.classList.add('animateText')
}
</script>

<style lang="scss" scoped>
$vm_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return calc($px / $vm_fontsize ) * 1rem;
}

// 根元素大小使用 vw 单位
$vm_design: 750;
@keyframes messageFilter {
  0% {
    transform: scale(0);
    transform: translateY(-10px);
    filter: blur(2px);
  }
  100% {
    transform: scale(1);
  }
}
.animateText {
  animation: messageFilter 300ms linear;

}
.player-container {
  font-size: rem(16);
  color: #ffffff;
  padding: rem(16);
  .info-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .cover-container {
      width: rem(60);
      height: rem(60);
      margin-right: rem(16);
      transition: all 300ms linear;
      img {
        border-radius: rem(10);
        width: 100%;
      }
    }
    .small-cover-container {
      width: rem(30);
      height: rem(30);
      transition: all 300ms linear;
      img {
        border-radius: rem(30);
        width: 100%;
      }
    }
    .title-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      p {
        margin: 0;
      }
      .song-style {
        width: rem(180);
        color: #b2b2b2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
      }
    }
    .wave-container {
      width: rem(50);
      height: rem(50);
      border-radius: rem(50);
    }
    .small-wave-container {
      width: rem(30);
      height: rem(30);
      border-radius: rem(30);
    }
  }
  .operation-container {
    display: flex;
    font-size: rem(8);
    color: #b2b2b2;
    font-weight: 600;
    justify-content: space-around;
    margin-top: rem(8);
    .progress {
      width: rem(200);
      display: flex;
      align-items: center;
      .progress-back {
        width: 100%;
        height: rem(5);
        border-radius: rem(3);
        background: rgba(178, 178, 178, 0.34);
        .progress-front {
          width: 0%;
          height: 100%;
          border-radius: rem(3);
          background: #ffffff;
        }
      }
    }
    .duration {
      width: rem(25);
    }
  }
  .control-container {
    display: flex;
    justify-content: center;
    margin-top: rem(8);
    .btn {
      width: rem(32);
      height: rem(32);
      margin-right: rem(32);
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
