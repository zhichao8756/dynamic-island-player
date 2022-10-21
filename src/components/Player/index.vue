<template>
  <div class="player-container">
    <div class="info-container">
      <div class="cover-container">
        <img ref="coverRef" src="../../assets/cover.jpg" alt="">
      </div>
      <div v-show="props.animateState !== 'smaller'" class="title-container">
        <p>{{ songInfo.title }}</p>
        <p class="song-style">{{ songInfo.author }}</p>
      </div>
      <div ref="waveRef" class="wave-container" />
    </div>
    <div class="operation-container">
      <div ref="track" class="track">0:00</div>
      <div class="progress">
        <div class="progress-back">
          <div ref="progress" class="progress-front" />
        </div>
      </div>
      <div ref="duration" class="duration">{{ songInfo.duration }}</div>
    </div>
    <div class="control-container">
      <div class="previous btn" />
      <div v-if="playState" class="play btn" @click="toggle" />
      <div v-else class="pause btn" @click="toggle" />
      <div class="next btn" style="margin-right: 0" @click="next" />
    </div>
  </div>
</template>

<script setup>
import SiriWave from 'siriwave'
import Player from '@/components/Player/player.js'
import { nextTick, onMounted, reactive, ref } from 'vue'
import ColorThief from '@node_modules/colorthief/dist/color-thief.mjs'
import song1 from '@/assets/audio/rave_digger.mp3'
import song2 from '@/assets/audio/80s_vibe.mp3'

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
        author: 'Cherrystones'
      },
      {
        title: '80s Vibe',
        file: song2,
        howl: null,
        author: 'Tory Lanez'
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
const songInfo = reactive({
  title: props.playList[0].title,
  author: props.playList[0].author,
  duration: '0:00'
})
onMounted(async () => {
  await nextTick()
  initWave()
})
function play () {
  playerInst.value = new Player(props.playList, track.value, progress.value, duration.value)
  // 此处添加target 查询目标dom
  playerInst.value.play().then(res => {
    songInfo.title = res.title
    songInfo.author = res.author
  })
}
function stop () {
  playerInst.value.pause()
}
function initWave () {
  getImgColor().then(() => {
    waveInstance.value = new SiriWave({
      container: waveRef.value,
      width: 50,
      height: 50,
      style: 'ios',
      curveDefinition: colorPalette.value,
      autostart: false
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
          { attenuation: 1, lineWidth: 2, opacity: 1, color: colorList[2].join(',') }
        ]
        resolve()
      }
    })
  })
}
function toggle () {
  if (playState.value) {
    console.log(2222)
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
    console.log(res)
    songInfo.title = res.title
    songInfo.author = res.author
    songInfo.duration = res.duration
  })
  playState.value = false
}
</script>

<style lang="scss" scoped>
$vm_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return calc($px / $vm_fontsize ) * 1rem;
}

// 根元素大小使用 vw 单位
$vm_design: 750;
.player-container {
  font-size: rem(16);
  color: #ffffff;
  padding: rem(16);
  .info-container {
    display: flex;
    .cover-container {
      width: rem(60);
      height: rem(60);
      margin-right: rem(16);
      img {
        border-radius: rem(10);
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
