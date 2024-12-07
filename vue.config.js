const { defineConfig } = require('@vue/cli-service')
const name = process.env.VUE_APP_TITLE || '报名系统' // 网页标题
module.exports = defineConfig({
  transpileDependencies: true,
  //关闭eslint校验
  lintOnSave:false
})
