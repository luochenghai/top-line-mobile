module.exports = {
  presets: [
    '@vue/app'
  ],
  // vant 官网推荐配置
  plugins: [
    [
      'import', {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      }, 'vant'
    ]
  ]
}
