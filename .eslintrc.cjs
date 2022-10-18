// .eslintrc.js 文件
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    // 新增这里vue3支持
    'plugin:vue/vue3-recommended'
  ],
  // 这是初始生成的 将其中的内容更改为下面的
  // parserOptions: {
  //   ecmaVersion: 'latest',
  //   sourceType: 'module'
  // },

  // 新的内容
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true
    },
    requireConfigFile: false,
    parser: '@babel/eslint-parser'
  },
  plugins: [
    'vue'
  ],
  rules: {
    semi: [2, 'never'], // 禁止尾部使用分号“ ; ”
    'no-var': 'error', // 禁止使用 var
    indent: ['error', 2], // 缩进2格
    'no-mixed-spaces-and-tabs': 'error', // 不能空格与tab混用
    quotes: [2, 'single'], // 使用单引号
    'vue/html-closing-bracket-newline': 'off', // 不强制换行
    'vue/singleline-html-element-content-newline': 'off', // 不强制换行
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 5 },
      multiline: { max: 5 }
    }] // vue template模板元素第一行最多5个属性
    // 其它的规则可以去eslint查看，根据自己需要进行添加
  }
}