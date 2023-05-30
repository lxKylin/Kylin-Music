// pages/detail-songs/index.js
import { rankingStore } from "../../store/index";
import { getRankings } from "../../service/api_music";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    rankingName: "",
    songInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type;
    this.setData({ type });
    if (type === "menu") {
      const id = options.id;
      getRankings(id).then((res) => {
        this.setData({ songInfo: res.playlist });
      });
    } else if (type === "ranking") {
      const rankingName = options.rankingName;
      this.setData({ rankingName });

      // 1、获取数据
      rankingStore.onState(rankingName, this.getRankingdataHander);
    }
  },

  getRankingdataHander(res) {
    this.setData({ songInfo: res });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.data.rankingName &&
      rankingStore.offState(this.data.rankingName, this.getRankingdataHander);
  },
});
