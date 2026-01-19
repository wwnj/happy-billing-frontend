module.exports = {
  plugins: {
    autoprefixer: {},
    // 注释掉 postcss-px-to-viewport，因为这是桌面端管理系统
    // 如果需要移动端适配，可以取消注释并调整配置
    // 'postcss-px-to-viewport': {
    //   viewportWidth: 1920,       // 桌面端设计稿宽度
    //   viewportUnit: 'vw',        // 转换单位
    //   selectorBlackList: ['.el-'], // Element Plus 不转换
    //   minPixelValue: 1,
    //   mediaQuery: false,
    //   exclude: [/node_modules/], // 排除 node_modules
    // },
  },
}
