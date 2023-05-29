// pages/home-music/index.js
import { rankingStore } from "../../store/index";

import { getBanners, getSongMenu } from "../../service/api_music";
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

    recommendSongs: [],

    hotSongMenu: [],
    recomendSongMenu: [],

    rankings: { newRanking: {}, originRanking: {}, upRanking: {} },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取页面数据
    this.getPagedata();

    // 发起共享数据
    rankingStore.dispatch("getRankingdataAction");

    // 从store中获取共享的数据
    // rankingStore.onState("hotRanking", (res) => {
    //   if (!res.tracks) return;
    //   const recommendSongs = res.tracks.slice(0, 6);
    //   this.setData({ recommendSongs });
    // });
    this.setupPlayerStoreListener();
  },

  // 事件处理
  handleSearchClick() {
    wx.navigateTo({
      url: "/pages/detail-search/index",
    });
  },
  handleMoreClick() {
    this.navigateToDetailSongsPage("hotRanking");
  },
  handleRankingItemClick(event) {
    const rankingName = event.currentTarget.dataset.ranking;
    this.navigateToDetailSongsPage(rankingName);
  },

  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?rankingName=${rankingName}`,
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

    getSongMenu().then((res) => {
      this.setData({ hotSongMenu: res.playlists });
    });

    getSongMenu("华语").then((res) => {
      this.setData({ recommendSongMenu: res.playlists });
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  setupPlayerStoreListener() {
    // 1.排行榜监听
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs });
    });
    rankingStore.onState("newRanking", this.getRankingHandler("newRanking"));
    rankingStore.onState(
      "originRanking",
      this.getRankingHandler("originRanking")
    );
    rankingStore.onState("upRanking", this.getRankingHandler("upRanking"));

    // 2.播放器监听
    // playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
    //   if (currentSong) this.setData({ currentSong })
    //   if (isPlaying !== undefined) {
    //     this.setData({
    //       isPlaying,
    //       playAnimState: isPlaying ? "running": "paused"
    //     })
    //   }
    // })
  },

  getRankingHandler(id) {
    return (res) => {
      if (Object.keys(res).length === 0) return;
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      // 拿到前3条数据
      const songList = res.tracks.slice(0, 3);
      const rankingObj = { name, coverImgUrl, playCount, songList };
      const newRankings = { ...this.data.rankings, [id]: rankingObj };
      this.setData({
        rankings: newRankings,
      });
    };
  },
});
