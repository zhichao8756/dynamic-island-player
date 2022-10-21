<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import DynamicIsland from '@/components/DynamicIsland/index.vue'
</script>

<template>
  <div style="margin-top: 100px">
    <div id="iphone14pro">
      <DynamicIsland />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$vm_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return calc($px / $vm_fontsize ) * 1rem;
}

// 根元素大小使用 vw 单位
$vm_design: 750;
* {
  margin: 0;
  padding: 0;
}
#iphone14pro {
  position: relative;
  margin: auto;
  width: rem(375);
  height: rem(344);
  overflow: hidden;
  background-image: url(https://www.apple.com.cn/v/iphone-14-pro/a/images/overview/dynamic-island/dynamic_hw__btl4fomgspyu_large.png);
  background-size: 100% 100%;
}
</style>
