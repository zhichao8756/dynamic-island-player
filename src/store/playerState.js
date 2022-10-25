import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  // 其它配置项
  state: () => {
    return {
      title: '',
      author: '',
      cover: '',
      soundState: ''
    }
  }
})
