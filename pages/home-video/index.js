// pages/home-video/index.js
import { getTopMV } from '../../service/api_video';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    // 是否还有更多的数据
    hasMore: true
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
    // try {
    //   const res = await getTopMV(0);
    //   this.setData({ topMVs: res.data || [] });
    // } catch (err) {
    //   console.log(err);
    // }

    // 优化
    this.getTopMVData(0);
  },

  /**
   * 封装网络请求的方法
   */
  async getTopMVData(offset) {
    try {
      // 判断是否可以请求数据
      if (!this.data.hasMore && offset !== 0) return;

      // 展示加载动画
      wx.showNavigationBarLoading();

      // 请求数据
      const res = await getTopMV(offset);
      let newData = this.data.topMVs;
      // 如果offset为0,那么就是第一次请求，否则进行拼接
      if (offset === 0) {
        newData = res.data;
      } else {
        newData = newData.concat(res.data);
      }

      // 设置数据
      this.setData({ topMVs: newData });
      this.setData({ hasMore: res.hasMore });

      // 关闭加载动画
      wx.hideNavigationBarLoading();
      if (offset === 0) {
        wx.stopPullDownRefresh();
      }
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * 封装事件处理的方法
   */
  handleVideoItemClick(event) {
    // 获取id
    const id = event.currentTarget.dataset.item.id;

    // 页面跳转
    wx.navigateTo({
      url: `/packageDetail/pages/detail-video/index?id=${id}`
    });
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
    // try {
    //   const res = await getTopMV(0);
    //   this.setData({ topMVs: res.data || [] });
    // } catch (err) {
    //   console.log(err);
    // }

    this.getTopMVData(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    // try {
    //   if (!this.data.hasMore) return;
    //   // 0～9
    //   // 10～19
    //   const res = await getTopMV(this.data.topMVs.length);
    //   // 不能直接赋值，不然会覆盖原来的数据，应该追加
    //   this.setData({ topMVs: this.data.topMVs.concat(res.data) });
    //   this.setData({ hasMore: res.hasMore });
    // } catch (err) {
    //   console.log(err);
    // }

    this.getTopMVData(this.data.topMVs.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
});
