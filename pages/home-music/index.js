// pages/home-music/index.js
import { getBanners } from "../../service/api_music";
import queryRect from "../../utils/query-rect";
import throttle from "../../utils/throttle";

// 对 queryRect函数 进行节流
const throttleQueryRect = throttle(queryRect, 1000);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPagedata();
  },

  // 事件处理
  handleSearchClick() {
    wx.navigateTo({
      url: "/pages/detail-search/index",
    });
  },

  // 图片加载完成
  handleSwiperImageLoaded() {
    // 获取图片高度(如何获取组件的高度)
    // const query = wx.createSelectorQuery();
    // query.select(".swiper-image").boundingClientRect();

    // query.selectViewport().scrollOffset();
    // query.exec((res) => {
    //   const rect = res[0];
    //   this.setData({ swiperHeight: rect.height });
    // });

    // 优化
    // queryRect(".swiper-image").then((res) => {
    //   const rect = res[0];
    //   this.setData({ swiperHeight: rect.height });
    // });

    // 节流优化
    throttleQueryRect(".swiper-image").then((res) => {
      const rect = res[0];
      this.setData({ swiperHeight: rect.height });
    });
  },

  // 网络请求
  getPagedata() {
    getBanners().then((res) => {
      this.setData({ banners: res.banners });
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},
});
