// pages/home-video/index.js
import { getTopMV } from "../../service/api_video";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    // 是否还有更多的数据
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载(created)
   */
  // onLoad(options) {
  //   getTopMV(0)
  //     .then((res) => {
  //       console.log(res);
  //       this.setData({ topMVs: res.data || [] });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // },
  async onLoad(options) {
    try {
      const res = await getTopMV(0);
      this.setData({ topMVs: res.data || [] });
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    try {
      const res = await getTopMV(0);
      this.setData({ topMVs: res.data || [] });
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    try {
      if (!this.data.hasMore) return;
      // 0～9
      // 10～19
      const res = await getTopMV(this.data.topMVs.length);
      // 不能直接赋值，不然会覆盖原来的数据，应该追加
      this.setData({ topMVs: this.data.topMVs.concat(res.data) });
      this.setData({ hasMore: res.hasMore });
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
