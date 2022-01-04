const {baseURL} = require('../config/config')
const app = getApp()

const userid = wx.getStorageSync('userid') || {}

const axios = (path, d={}, method = 'GET') => {
  let uerid = app.globalData.userid
  console.log('---------',uerid);
  let  url= baseURL+path
  let data = Object.assign({}, d,userid)
  wx.showLoading({
    title: '加载中',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      timeout:5000,
      success(res) {
        resolve(res.data)
      },
      fail(err){
        reject(err)
      },
      complete(){
        wx.hideLoading()
      }
    })

  })
}


module.exports = axios