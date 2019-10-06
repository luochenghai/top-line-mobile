module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    // 配置 REM 适配 使用 postcss-pxtorem 将 px 转为 rem
    // npm install postcss-pxtorem --save-dev
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}

/******
 * 注意：
- 只能转换单独的 css 文件、.vue 文件中的 style 中的 px
- 不能转换行内样式中的  px
 *****/
