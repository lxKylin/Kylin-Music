// pages/home-profile/index.js

import { getUserInfo } from '../../service/api_login';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  async handleGetUser() {
    // 现在使用的基础库不支持了，需要查看文档
    const userInfo = await getUserInfo();
    this.setData({ userInfo });
    console.log(userInfo);
  },
  handleGetPhoneNumber(event) {
    console.log(event);
  }
});
