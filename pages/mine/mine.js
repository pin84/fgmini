// index.js
// 获取应用实例
let tokenAndLink = require('../../behaviors/tokenAndLink');

Page({
  data: {
    canIUseGetUserProfile: false,
    userInfo: {},
    __img: app.$img, // 图片
    menuInfos: app.$mock.mine.menuInfos || [], // 功能
  },
  // behaviors
  behaviors: [tokenAndLink],
  // 页面点击事件
  pageClick(e) {
    if (!this.mixin_checkToken(this.userLogin)) return false;
    let target = e.currentTarget.dataset;
    switch (target.type) {
      case "nav": // 功能区点击
        this.mixin_handleLink({
          type: target.item.linkType,
          url: target.item.linkAddress,
        });
        break;
      default:
        console.warn("未定义事件", e);
        break;
    }
  },
  // 登录相关
  userLogin() {
    app.$auth.login().then(res => {
      console.log("get userInfo and code => ", res);
      if (res.userInfo) {
        this.setData({
          userInfo: res.userInfo || {},
        })
        wx.setStorageSync('userInfo', res.userInfo || "");
        wx.setStorageSync('token', "pass");
      }
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || {},
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})