const e = {
  methods: {
    // 校验Token
    mixin_checkToken(fn) {
      let tempToken = wx.getStorageSync('token');
      // 没有token执行登录操作
      if (fn) {
        !tempToken && fn();
      } else {
        !tempToken && wx.showModal({
          title: '提示',
          content: '使用该功能前需要进行登录操作',
          showCancel: true,
          confirmText: '确定',
          confirmColor: "#3E8E8B",
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/mine/mine' // 指定页面的url
              });
            }
          }
        })
      }
      return !!tempToken;
    },
    // 跳转页面相关逻辑
    mixin_handleLink(urlMsg = {}) {
      if (!urlMsg.url) {
        wx.showToast({
          title: '敬请期待...',
          icon: 'none'
        });
        return false;
      };
      let { url, data } = urlMsg;
      switch (urlMsg.type) {
        case "page": // 本地页面
          url && wx.navigateTo({
            url: url.trim()
          });
          break;
        case "h5": // 外部页（webview）
          // wx.navigateTo({
          //   url: `/pages/webview/webview?url=${encodeURIComponent(url.trim())}`,
          // });
          break;
        case "third": // 第三方小程序
          wx.navigateToMiniProgram(data || {});
          break;
        default:
          console.warn("未定义事件");
          break;
      }
    }
  }
}

module.exports = Behavior(e)