// components/area-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题",
    },
    rightText: {
      type: String,
      value: "更多",
    },
    isShowMore: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleRightClick() {
      // 将点击事件发送出去
      // click是可自定义的，也还可以传出其他数据
      this.triggerEvent("click");
    },
  },
});
