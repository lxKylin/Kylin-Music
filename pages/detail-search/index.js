// pages/detail-search/index.js
import {
  getSearchHot,
  getSearchSuggest,
  getSearchResult,
} from "../../service/api_search";
import debounce from "../../utils/debounce";
import stringToNodes from "../../utils/string2nodes";

// 处理防抖
const debounceGetSearchSuggest = debounce(getSearchSuggest, 300);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData();
  },

  // 网络请求
  getPageData() {
    getSearchHot().then((res) => {
      this.setData({ hotKeywords: res.result.hots });
    });
  },

  // 事件处理
  // 输入框输入值改变
  handleSearchChange(event) {
    // 1、获取关键词
    const searchValue = event.detail;
    // 2、设置关键词
    this.setData({ searchValue });
    // 3.判断关键字为空字符的处理逻辑
    if (!searchValue) {
      this.setData({ suggestSongs: [], resultSongs: [] });
      return;
    }
    // 4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then((res) => {
      // this.setData({ suggestSongs: res.result.allMatch });

      // 1.获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch;
      this.setData({ suggestSongs });
      if (!suggestSongs) return;

      // 2.转成nodes节点
      const suggestKeywords = suggestSongs.map((item) => item.keyword);
      const suggestSongsNodes = [];
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue);
        suggestSongsNodes.push(nodes);
      }
      this.setData({ suggestSongsNodes });
    });
  },

  // 回车搜索
  handleSearchAction() {
    const keywords = this.data.searchValue;
    getSearchResult(keywords).then((res) => {
      this.setData({ resultSongs: res.result.songs });
    });
  },

  // 点击歌曲搜索
  handleKeywordItemClick(event) {
    // 1.获取点击的关键字
    const keyword = event.currentTarget.dataset.keyword;

    // 2.将关键设置到searchValue中
    this.setData({ searchValue: keyword });

    // 3.发送网络请求
    this.handleSearchAction();
  },
});
