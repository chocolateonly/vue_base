const { defineConfig } = require('@vue/cli-service')
const {resolve} = require("@babel/core/lib/vendor/import-meta-resolve");
module.exports = defineConfig({
  transpileDependencies: true,
  //关闭eslint校验
  lintOnSave:false,
  configureWebpack: {
    name: name,
    resolve: {
      extensions: ['.js', '.vue', '.json'], // 新增的代码
      alias: {
        '@': resolve('src')
      }
    }
  }


})
