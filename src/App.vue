<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { DynamicIslandPlayer } from '@/components/index.js'
</script>

<template>
  <div style="margin-top: 100px">
    <!--    <div id="iphone14pro">

    </div>-->
    <DynamicIslandPlayer />
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
</style>
