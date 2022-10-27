<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { DynamicIslandPlayer } from '@/components/index.js'
import { ref } from 'vue'
// import song1 from '@/assets/audio/rave_digger.mp3'
// import song2 from '@/assets/audio/80s_vibe.mp3'
import cover1 from '@/assets/vue.svg'
// import cover2 from '@/assets/cover2.png'
const player = ref()
const playList = ref([
  {
    title: 'Rave Digger',
    file: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
    howl: null,
    author: 'Cherrystones',
    cover: cover1
  }
])
function test () {
  console.log('233223')
}
function play () {
  console.log('play')
}
function next () {
  console.log('next')
}
function previous () {
  console.log('previous')
}
function pause () {
  console.log('pause')
}
function set () {
  player.value.setVolume(0.9)
}
function setMute () {
  player.value.setMute(true)
}
function setSound () {
  player.value.setMute(false)
}
function seekTo () {
  player.value.seekBySeconds(30)
}
function toggle () {
  player.value.toggle()
}
function playNext () {
  player.value.playNext()
}
function playPrevious () {
  player.value.playPrevious()
}
function getState () {
  console.log(player.value.getSoundState())
}
</script>

<template>
  <div style="margin-top: 100px">
    <!--    <div id="iphone14pro">

    </div>-->
    <DynamicIslandPlayer
      ref="player"
      :play-list="playList"
      :volume="0.8"
      :html5="true"
      @play="play"
      @next="next"
      @pause="pause"
      @previous="previous"
      @animation-small="test" />
  </div>
  <div class="control-area">
    <button @click="getState">get sound state</button>
    <button @click="set">set volume</button>
    <button @click="setMute">set mute</button>
    <button @click="setSound">set sound</button>
    <button @click="seekTo">jumpTo 30s</button>
    <button @click="toggle">play / pause</button>
    <button @click="playNext">next song</button>
    <button @click="playPrevious">previous song</button>
  </div>
</template>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
#iphone14pro {
  position: relative;
  margin: auto;
  width: 375px;
  height: 344px;
  overflow: hidden;
  background-image: url(https://www.apple.com.cn/v/iphone-14-pro/a/images/overview/dynamic-island/dynamic_hw__btl4fomgspyu_large.png);
  background-size: 100% 100%;
}
.control-area button{
  margin: 10px 10px;
}
</style>
