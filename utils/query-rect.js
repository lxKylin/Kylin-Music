export default function (selector) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery();
    query.select(selector).boundingClientRect();

    query.selectViewport().scrollOffset();
    // 性能更高
    // query.exec(resolve)
    query.exec((res) => {
      resolve(res);
    });
  });
}
