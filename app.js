// app.js

// 注册小程序实例
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRadio: 0 // 高宽比
  },
  // 应用程序启动时
  onLaunch() {
    // 获取设备信息
    const info = wx.getSystemInfoSync();
    // info中有screenWidth
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;

    // 导航栏高度
    this.globalData.statusBarHeight = info.statusBarHeight;

    const deviceRadio = info.screenHeight / info.screenWidth;
    this.globalData.deviceRadio = deviceRadio;
  }
});
