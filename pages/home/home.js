// pages/home/home.js
const axios = require('../../utils/axios')
const {
  uploadURL
} = require('../../config/config')
const filrUpload = require('../../utils/fileUpload')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temImgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.initData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {



  },


  async upload() {
    let files = this.data.temImgList
    if(files.length == 0) {
      wx.showToast({
        title: '请先选择照片',
        icon: 'error',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })

    console.log(this.data.temImgList);
    let uploads = []
    files.forEach(obj => {
      uploads.push(filrUpload(uploadURL, obj.tempFilePath))
    })

    let tips = '上传成功'
    Promise.all(uploads).then(res => {
     
      console.log('----',res);
      this.setData({
        temImgList:[]
      });
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content:'上传成功',
        showCancel: false,
        success(res) {
          
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }).catch(err=>{
      console.log(err);
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content:  '上传失败',
        showCancel: false,
      })
    })
  },

  deleteMedia(e) {
    let index = e.currentTarget.dataset.index
    let temImgList = this.data.temImgList
    temImgList.splice(index, 1)
    this.setData({
      temImgList
    });
  },

  async uploadImg() {
    let temImgList = this.data.temImgList
    if (temImgList.length > 8) return

    let restLen = 9 - temImgList.length

    console.log(restLen);
    wx.chooseMedia({
      count: restLen,
      mediaType: ['mix'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      sizeType: 'compressed',
      success: (res) => {
        let {
          tempFiles
        } = res
        tempFiles.forEach(item => {
          temImgList.push(item)
        })
        this.setData({
          temImgList
        });
      },

      complete: (e) => {
        // console.log(e);
      }
    })
  },

  previewMedia(e) {

    let {
      tempFilePath,
      fileType,
    } = e.currentTarget.dataset.item
    wx.previewMedia({
      sources: [{
        url: tempFilePath,
        type: fileType
      }],
      success: (res) => {
        // console.log(res);
      },
      fail: (err) => {
        // console.log(err);
      },
      complete: (e) => {
        // console.log(e);
      }

    })

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})