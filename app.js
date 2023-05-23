// app.js

// 注册小程序实例
App({
  // 应用程序启动时
  onLaunch() {
    // 获取设备信息
    const info = wx.getSystemInfoSync();
    // info中有screenWidth
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
  },
});
