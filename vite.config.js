import { defineConfig } from 'vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
// const path = require('path')
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), DefineOptions()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@node_modules': path.resolve(__dirname, './node_modules')
    }
  },
  /* css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/global.scss";'
      }
    }
  }, */
  server: {
    host: '0.0.0.0'
  },
  build: {
    outDir: 'js-dynamic-island', // 输出文件名称
    lib: {
      entry: path.resolve(__dirname, './src/components/index.js'), // 指定组件编译入口文件
      name: 'js-dynamic-island',
      fileName: 'js-dynamic-island'
    }, // 库编译模式配置
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    } // rollup打包配置
  }
})
