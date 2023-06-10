// app.js

import {
  getLoginCode,
  codeToToken,
  checkToken,
  checkSession
} from './service/api_login';
import { TOKEN_KEY } from './constants/token-constant';

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
  async onLaunch() {
    // 1、获取设备信息
    const info = wx.getSystemInfoSync();
    // info中有screenWidth
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;

    // 导航栏高度
    this.globalData.statusBarHeight = info.statusBarHeight;

    const deviceRadio = info.screenHeight / info.screenWidth;
    this.globalData.deviceRadio = deviceRadio;

    // 2、让用户默认进行登陆
    this.handleLogin();
  },

  async handleLogin() {
    const token = wx.getStorageSync(TOKEN_KEY);

    // 检查session_key有无过期
    const isSessionExpire = await checkSession();

    // token有无过期
    const checkResult = await checkToken();
    console.log(checkResult);

    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction();
    }
  },

  async loginAction() {
    // 1、获取code
    const code = await getLoginCode();

    // 2、将code发送给服务器
    const result = await codeToToken(code);
    const token = result.token;

    wx.setStorageSync(TOKEN_KEY, token);
  }
});
