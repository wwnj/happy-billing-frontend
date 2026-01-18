module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportWidth: 375,        // 设计稿宽度
      viewportUnit: 'vw',        // 转换单位
      selectorBlackList: ['.el-'], // Element Plus 不转换
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/node_modules/], // 排除 node_modules
    },
  },
}
