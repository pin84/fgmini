// app.js
import api from './utils/api'
import { baseURL } from './config/config'

const CORE = require('./utils/core');
// 全局定义app
CORE.mount(Object.prototype, 'app', () => getApp());

App({
  onLaunch() {
    // 检查是否有可更新版本
    CORE.info.version();

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let { code } = res
        wx.request({
          url: baseURL + api.code2Session,
          data: {
            code: code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: (result) => {
            wx.setStorageSync('userid', result.data)
            this.globalData.userid = result.data
          },
          fail: (err) => {
            console.log(err);
          },
          complete: () => {
            // console.log('afb');
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    userid: null
  },
  // 获取小程序相关信息
  $info: CORE.info,
  // 图片相关
  $img: CORE.img,
  // MOCK
  $mock: CORE.mock,
})
