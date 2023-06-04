// baseui/nav-bar/index.js
const globalData = getApp().globalData;

Component({
  options: {
    // 设置可以使用多个插槽
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: globalData.statusBarHeight,
    navBarHeight: globalData.navBarHeight,
  },

  /**
   * 生命周期函数
   */
  lifetimes: {
    // 相当于mounted
    // ready() {
    //   const info = wx.getSystemInfoSync();
    // },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLeftClick: function () {
      this.triggerEvent("click");
    },
  },
});
