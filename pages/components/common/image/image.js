// components/common/image/image.js
Component({
  // 支持传入样式
  externalClasses: ['img-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      observer: function (n, o) {
        this.setData({
          imgUrl: n || ""
        });
      },
    },
    options: {
      type: Object,
      value: () => ({}),
      observer: function (n, o) {
        this.setData({
          comOptions: {
            ...this.data.comOptions, 
            ...n,
          },
        })
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: "",
    comOptions: {
      src: "",
      mode: "aspectFill", 
      lazyLoad: true,
      longpress: false,
      errorImg: app.$img.common.errorImg, // 错误图片显示
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _imgLoad(e) {
      app.$img.common.errorImg !== this.data.imgUrl && this.setData({
        'comOptions.mode': "aspectFill",
      })
    },
    _imgError(e) {
      this.setData({
        imgUrl: app.$img.common.errorImg,
        'comOptions.mode': "aspectFit",
      })
    }
  }
})
